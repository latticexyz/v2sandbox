import { setupMUDV2Network } from "@latticexyz/std-client";
import { createFaucetService } from "@latticexyz/network";
import { getNetworkConfig } from "./getNetworkConfig";
import { defineContractComponents } from "./contractComponents";
import { clientComponents } from "./clientComponents";
import { world } from "./world";
import { utils } from "ethers";
import { IWorld__factory } from "../../../contracts/types/ethers-contracts/factories/IWorld__factory";
import {
  defineQuery,
  getComponentValue,
  Has,
  overridableComponent,
} from "@latticexyz/recs";
import { awaitStreamValue, uuid } from "@latticexyz/utils";

export type SetupResult = Awaited<ReturnType<typeof setup>>;

export async function setup() {
  const contractComponents = defineContractComponents(world);
  const networkConfig = await getNetworkConfig();
  const result = await setupMUDV2Network<typeof contractComponents>({
    networkConfig,
    world,
    contractComponents,
    syncThread: "main",
  });

  result.startSync();

  // Request drip from faucet
  const signer = result.network.signer.get();
  if (!networkConfig.devMode && networkConfig.faucetServiceUrl && signer) {
    const address = await signer.getAddress();
    console.info("[Dev Faucet]: Player address -> ", address);

    const faucet = createFaucetService(networkConfig.faucetServiceUrl);

    const requestDrip = async () => {
      const balance = await signer.getBalance();
      console.info(`[Dev Faucet]: Player balance -> ${balance}`);
      const lowBalance = balance?.lte(utils.parseEther("1"));
      if (lowBalance) {
        console.info("[Dev Faucet]: Balance is low, dripping funds to player");
        // Double drip
        await faucet.dripDev({ address });
        await faucet.dripDev({ address });
      }
    };

    requestDrip();
    // Request a drip every 20 seconds
    setInterval(requestDrip, 20000);
  }

  const worldContract = IWorld__factory.connect(
    networkConfig.worldAddress,
    signer || result.network.providers.get().json
  );

  const components = {
    ...result.components,
    Position: overridableComponent(result.components.Position),
    ...clientComponents,
  };

  const moveTo = async (x: number, y: number) => {
    if (!result.playerEntity) {
      throw new Error("no player");
    }

    const mapConfig = getComponentValue(
      components.MapConfig,
      result.singletonEntity
    );
    if (!mapConfig) {
      console.warn("moveTo called before mapConfig loaded/initialized");
      return;
    }

    const wrappedX = (x + mapConfig.width) % mapConfig.width;
    const wrappedY = (y + mapConfig.height) % mapConfig.height;

    // const obstructed = runQuery([
    //   Has(components.Obstruction),
    //   HasValue(components.Position, { x: wrappedX, y: wrappedY }),
    // ]);
    // if (obstructed.size > 0) {
    //   console.warn("cannot move to obstructed space");
    //   return;
    // }

    const inEncounter =
      getComponentValue(components.Encounter, result.playerEntity)?.value !=
      null;
    if (inEncounter) {
      console.warn("cannot move while in encounter");
      return;
    }

    const positionId = uuid();
    components.Position.addOverride(positionId, {
      entity: result.playerEntity,
      value: { x: wrappedX, y: wrappedY },
    });

    try {
      const tx = await worldContract.move(x, y, {
        gasLimit: 1_000_000,
        gasPrice: 0,
      });
      await awaitStreamValue(result.txReduced$, (txHash) => txHash === tx.hash);
    } finally {
      components.Position.removeOverride(positionId);
    }
  };

  const moveBy = async (deltaX: number, deltaY: number) => {
    if (!result.playerEntity) {
      throw new Error("no player");
    }

    const playerPosition = getComponentValue(
      components.Position,
      result.playerEntity
    );
    if (!playerPosition) {
      console.warn("cannot moveBy without a player position, not yet spawned?");
      return;
    }

    await moveTo(playerPosition.x + deltaX, playerPosition.y + deltaY);
  };

  return {
    ...result,
    components,
    worldContract,
    api: {
      moveTo,
      moveBy,
    },
  };
}
