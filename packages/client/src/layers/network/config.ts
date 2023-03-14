import { SetupContractConfig } from "@latticexyz/std-client";
import chainSpec from "../../../../contracts/chainSpec.json";
import { getBurnerWallet } from "../../getBurnerWallet";

const params = new URLSearchParams(window.location.search);

export const faucetServiceUrl = params.get("faucet") ?? chainSpec.faucet;

export const config: SetupContractConfig = {
  clock: {
    period: 1000,
    initialTime: 0,
    syncInterval: 5000,
  },
  provider: {
    jsonRpcUrl: params.get("rpc") ?? chainSpec.rpc,
    wsRpcUrl: params.get("wsRpc") ?? chainSpec.wsRpc,
    chainId: parseInt(params.get("chainId") ?? "") || chainSpec.chainId,
  },
  privateKey: getBurnerWallet(),
  chainId: Number(params.get("chainId")) || chainSpec.chainId,
  snapshotServiceUrl: params.get("snapshot") ?? chainSpec.snapshot,
  initialBlockNumber: Number(params.get("initialBlockNumber") ?? 0),
  worldAddress: params.get("worldAddress")!,
  devMode: params.get("dev") === "true",
};
