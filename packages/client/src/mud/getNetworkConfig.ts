import { SetupContractConfig } from "@latticexyz/std-client";
import { burnerWallet } from "./burnerWallet";
import { supportedChains } from "./supportedChains";

type NetworkConfig = SetupContractConfig & {
  privateKey: string;
  faucetServiceUrl?: string;
};

export async function getNetworkConfig(): Promise<NetworkConfig> {
  const params = new URLSearchParams(window.location.search);

  const chain = supportedChains.find(
    (c) => c.id === import.meta.env.VITE_CHAIN_ID
  );
  if (!chain) {
    throw new Error(`Chain ${import.meta.env.VITE_CHAIN_ID} not found`);
  }

  const deploy = await import(
    `../../../contracts/deploys/${import.meta.env.VITE_CHAIN_ID}/latest.json`
  );

  if (!deploy) {
    throw new Error(
      `No deployment found for chain ${
        import.meta.env.VITE_CHAIN_ID
      }. Did you run \`mud deploy\`?`
    );
  }

  const worldAddress = params.get("worldAddress") || deploy.worldAddress;
  if (!worldAddress) {
    throw new Error("No world address provided");
  }

  return {
    clock: {
      period: 1000,
      initialTime: 0,
      syncInterval: 5000,
    },
    provider: {
      chainId: import.meta.env.VITE_CHAIN_ID,
      jsonRpcUrl: params.get("rpc") ?? chain.rpcUrls.default.http[0],
      wsRpcUrl: params.get("wsRpc") ?? chain.rpcUrls.default.webSocket?.[0],
    },
    privateKey: burnerWallet().value,
    chainId: import.meta.env.VITE_CHAIN_ID,
    snapshotServiceUrl: params.get("snapshot") ?? undefined,
    faucetServiceUrl: params.get("faucet") ?? undefined,
    worldAddress,
    initialBlockNumber:
      Number(params.get("initialBlockNumber")) || deploy.blockNumber || 0,
    devMode: params.get("dev") === "true",
  };
}
