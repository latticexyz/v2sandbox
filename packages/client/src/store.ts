import { createStore } from "zustand/vanilla";
import createReactStore from "zustand";
import { NetworkLayer } from "./layers/network/createNetworkLayer";
import { PhaserLayer } from "./layers/phaser/createPhaserLayer";

export type Store = {
  networkLayer: NetworkLayer | null;
  phaserLayer: PhaserLayer | null;
};

export type UIStore = {
  networkLayer: NetworkLayer;
  phaserLayer: PhaserLayer;
};

export const store = createStore<Store>(() => ({
  networkLayer: null,
  phaserLayer: null,
}));

export const useStore = createReactStore(store);

export const useMUD = () => {
  const { networkLayer, phaserLayer } = useStore();

  if (networkLayer === null || phaserLayer === null) {
    throw new Error("Store not initialized");
  }

  return {
    networkLayer,
    phaserLayer,
  } as UIStore;
};
