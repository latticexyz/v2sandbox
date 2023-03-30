import { SetupContractConfig } from "@latticexyz/std-client";
import { burnerWallet } from "./burnerWallet";
import { supportedChains } from "./supportedChains";

type NetworkConfig = SetupContractConfig & {
  privateKey: string;
  faucetServiceUrl?: string;
};

export async function getNetworkConfig(): Promise<NetworkConfig> {
  const params = new URLSearchParams(window.location.search);

  const chainId = Number(
    params.get("chainId") || import.meta.env.VITE_CHAIN_ID
  );
  const chain = supportedChains.find((c) => c.id === chainId);
  if (!chain) {
    throw new Error(`Chain ${chainId} not found`);
  }

  const deploy = await import(
    `../../../contracts/deploys/${chainId}/latest.json`
  );

  if (!deploy) {
    throw new Error(
      `No deployment found for chain ${chainId}. Did you run \`mud deploy\`?`
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
      chainId,
      jsonRpcUrl: params.get("rpc") ?? chain.rpcUrls.default.http[0],
      wsRpcUrl: params.get("wsRpc") ?? chain.rpcUrls.default.webSocket?.[0],
    },
    privateKey: burnerWallet().value,
    chainId,
    faucetServiceUrl:
      params.get("faucet") ?? chainId === 4242
        ? "https://faucet.testnet-mud-services.linfra.xyz"
        : undefined,
    snapshotServiceUrl:
      params.get("snapshot") ?? chainId === 4242
        ? "https://ecs-snapshot.testnet-mud-services.linfra.xyz"
        : undefined,
    // TODO: add mode
    worldAddress,
    initialBlockNumber:
      Number(params.get("initialBlockNumber")) || deploy.blockNumber || 0,
    devMode: params.get("dev") === "true",
  };
}
