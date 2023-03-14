import { createFaucetService } from "@latticexyz/network";
import { utils } from "ethers";
import { faucetServiceUrl } from "./config";
import { NetworkLayer } from "./createNetworkLayer";

export const startDrip = (layer: NetworkLayer) => {
  const faucet = createFaucetService(faucetServiceUrl);
  const address = layer.network.network.connectedAddress.get();
  console.info("[Dev Faucet]: Player Address -> ", address);

  const requestDrip = async () => {
    const balance = await layer.network.network.signer.get()?.getBalance();
    const playerIsBroke = balance?.lte(utils.parseEther("5"));
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
  setInterval(requestDrip, 20000);
};
