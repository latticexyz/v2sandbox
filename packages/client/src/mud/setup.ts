import { setupMUDV2Network } from "@latticexyz/std-client";
import { getNetworkConfig } from "./getNetworkConfig";
import { createFaucetService } from "@latticexyz/network";
import { utils } from "ethers";
import mudConfig from "../../../contracts/mud.config.mjs";

export type SetupResult = Awaited<ReturnType<typeof setup>>;

export async function setup() {
  const networkConfig = await getNetworkConfig();
  const result = await setupMUDV2Network({
    mudConfig,
    networkConfig,
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

  return result;
}
