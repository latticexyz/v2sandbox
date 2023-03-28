import { setupMUDNetwork } from "@latticexyz/std-client";
import { getNetworkConfig } from "./getNetworkConfig";
import { contractComponents, clientComponents } from "./components";
import { world } from "./world";
import { EntityID } from "@latticexyz/recs";
import { createFaucetService, SingletonID } from "@latticexyz/network";
import { utils } from "ethers";

export type SetupResult = Awaited<ReturnType<typeof setup>>;

export async function setup() {
  const networkConfig = await getNetworkConfig();
  const result = await setupMUDNetwork<typeof contractComponents, never>(
    networkConfig,
    world,
    contractComponents,
    {} as never,
    { syncThread: "main" }
  );

  result.startSync();

  // For LoadingState updates
  const singletonEntity = world.registerEntity({ id: SingletonID });

  // Register player entity
  const address = result.network.connectedAddress.get();
  if (!address) throw new Error("Not connected");

  const playerEntityId = address as EntityID;
  const playerEntity = world.registerEntity({ id: playerEntityId });

  const components = {
    ...result.components,
    ...clientComponents,
  };

  // Request drip from faucet
  if (!networkConfig.devMode && networkConfig.faucetServiceUrl) {
    const faucet = createFaucetService(networkConfig.faucetServiceUrl);
    console.info("[Dev Faucet]: Player Address -> ", address);

    const requestDrip = async () => {
      const balance = await result.network.signer.get()?.getBalance();
      console.info(`[Dev Faucet]: Player Balance -> ${balance}`);
      const playerIsBroke = balance?.lte(utils.parseEther("1"));
      console.info(`[Dev Faucet]: Player is broke -> ${playerIsBroke}`);
      if (playerIsBroke) {
        console.info("[Dev Faucet]: Dripping funds to player");
        // Double drip
        address &&
          (await faucet?.dripDev({ address })) &&
          (await faucet?.dripDev({ address }));
      }
    };

    requestDrip();
    // Request a drip every 20 seconds
    // TODO: tie this into tx queue instead?
    setInterval(requestDrip, 20000);
  }

  return {
    ...result,
    world,
    networkConfig,
    singletonEntityId: SingletonID,
    singletonEntity,
    playerEntityId,
    playerEntity,
    components,
  };
}
