import { setupMUDV2Network } from "@latticexyz/std-client";
import { createFastTxExecutor, createFaucetService } from "@latticexyz/network";
import { getNetworkConfig } from "./getNetworkConfig";
import { defineContractComponents } from "./contractComponents";
import { clientComponents } from "./clientComponents";
import { world } from "./world";
import { Signer, utils } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";
import { IWorld__factory } from "../../../contracts/types/ethers-contracts/factories/IWorld__factory";

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

  if (!signer) throw new Error("No signer");
  if (!signer.provider) throw new Error("No provider connected to the signer");

  // Create a World contract instance
  const worldContract = IWorld__factory.connect(
    networkConfig.worldAddress,
    signer
  );

  // Create a fast tx executor
  const { fastTxExecute } = await createFastTxExecutor(
    signer as Signer & { provider: JsonRpcProvider }
  );

  return {
    ...result,
    components: {
      ...result.components,
      ...clientComponents,
    },
    worldContract,
    fastTxExecute,
  };
}
