import { SetupContractConfig } from "@latticexyz/std-client";
import { Wallet } from "ethers";
import * as wagmiChains from "@wagmi/chains";

// TODO: move this to a chains/config package
const latticeTestnet = {
  name: "Lattice Testnet",
  id: 4242,
  network: "lattice-testnet",
  nativeCurrency: { decimals: 18, name: "Ether", symbol: "ETH" },
  rpcUrls: {
    default: {
      http: ["https://follower.testnet-chain.linfra.xyz"],
      webSocket: ["wss://follower.testnet-chain.linfra.xyz"],
    },
    public: {
      http: ["https://follower.testnet-chain.linfra.xyz"],
      webSocket: ["wss://follower.testnet-chain.linfra.xyz"],
    },
  },
} satisfies wagmiChains.Chain;

const chains = { ...wagmiChains, latticeTestnet };

// Load chain config
const env = import.meta.env;
const params = new URLSearchParams(window.location.search);
const chainId = Number(params.get("chainId") || env.VITE_CHAIN_ID);
const deploymentPath = `./deployments/${chainId}/latest.json`;
export const deployment = await import(deploymentPath);
export const chainConfig = Object.values(chains).find(
  (c) => c.id === chainId
) as wagmiChains.Chain | undefined;

if (!chainConfig) throw new Error(`Chain with ID ${chainId} not found`);

export const config: SetupContractConfig = {
  clock: {
    period: 1000,
    initialTime: 0,
    syncInterval: 5000,
  },
  provider: {
    jsonRpcUrl: params.get("rpc") ?? chainConfig.rpcUrls.default.http[0],
    wsRpcUrl: params.get("wsRpc") ?? chainConfig.rpcUrls.default.webSocket?.[0],
    chainId,
  },
  privateKey: Wallet.createRandom().privateKey,
  chainId,
  snapshotServiceUrl: params.get("snapshot") ?? undefined,
  initialBlockNumber: Number(
    params.get("initialBlockNumber") || deployment.blockNumber
  ),
  worldAddress: params.get("worldAddress") || deployment.worldAddress,
  devMode: params.get("dev") === "true",
};

console.log(`Loaded config from ${deploymentPath} and URL params:`);
console.info(config);
