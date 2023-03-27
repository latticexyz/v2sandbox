import { SetupContractConfig } from "@latticexyz/std-client";
import { Wallet } from "ethers";
import { foundry } from "@wagmi/chains";
import type { Chain } from "@wagmi/chains";
import { latticeTestnet } from "./latticeTestnet";
import localDeploy from "../../contracts/deploys/31337/latest.json";

const chains: Chain[] = [foundry, latticeTestnet];

const params = new URLSearchParams(window.location.search);
const chainId = Number(params.get("chainId") || import.meta.env.VITE_CHAIN_ID);
if (!chainId) {
  throw new Error("No chainId provided");
}

const chain = chains.find((c) => c.id === chainId);
if (!chain) {
  throw new Error(`Chain ${chainId} not found`);
}

const deploy = chain === foundry ? localDeploy : undefined;
if (!deploy) {
  throw new Error(`No deployment found for chain ${chainId}`);
}

export const config: SetupContractConfig = {
  clock: {
    period: 1000,
    initialTime: 0,
    syncInterval: 5000,
  },
  provider: {
    jsonRpcUrl: params.get("rpc") ?? chain.rpcUrls.default.http[0],
    wsRpcUrl: params.get("wsRpc") ?? chain.rpcUrls.default.webSocket?.[0],
    chainId,
  },
  privateKey: Wallet.createRandom().privateKey,
  chainId,
  snapshotServiceUrl: params.get("snapshot") ?? undefined,
  initialBlockNumber: Number(
    params.get("initialBlockNumber") || deploy.blockNumber
  ),
  worldAddress: params.get("worldAddress") || deploy.worldAddress,
  devMode: params.get("dev") === "true",
};
