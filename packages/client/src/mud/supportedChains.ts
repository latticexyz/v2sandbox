import type { Chain } from "@wagmi/chains";

// TODO: move this to MUD chains/config?

export const latticeTestnet = {
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
} as const satisfies Chain;

export const localhost = {
  id: 31337,
  name: "Localhost",
  network: "localhost",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["http://127.0.0.1:8545"],
      webSocket: ["ws://127.0.0.1:8545"],
    },
    public: {
      http: ["http://127.0.0.1:8545"],
      webSocket: ["ws://127.0.0.1:8545"],
    },
  },
} as const satisfies Chain;

export const supportedChains: Chain[] = [localhost, latticeTestnet];
