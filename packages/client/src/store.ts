import { createStore } from "zustand/vanilla";
import createReactStore from "zustand";
import { NetworkLayer } from "./layers/network/createNetworkLayer";
import { PhaserLayer } from "./layers/phaser/createPhaserLayer";

export type Store = {
  networkLayer: NetworkLayer | null;
  phaserLayer: PhaserLayer | null;
  devMode: boolean;
  messages: { message: string; color: string}[];
};

export const store = createStore<Store>(() => ({
  networkLayer: null,
  phaserLayer: null,
  devMode: false,
  messages: [],
}));

export const useStore = createReactStore(store);

/*
  * MUDStore is a wrapper around the store that provides a type-safe interface
  * to the store.
*/
export type MUDStore = {
  networkLayer: NetworkLayer;
  phaserLayer: PhaserLayer;
  devMode: boolean;
  messages: { message: string; color: string}[];
};

export const useMUD = () => {
  const { networkLayer, phaserLayer, devMode, messages } = useStore();

  if (networkLayer === null || phaserLayer === null) {
    throw new Error("Store not initialized");
  }

  return {
    networkLayer,
    phaserLayer,
    devMode,

    // Add UI state here
    messages,
  } as MUDStore;
};
