import React from "react";
import { useStore } from "../store";
import { Controls } from "./Controls";
import { Counter } from "./Counter";
import { ECSBrowser } from "./ECSBrowser";
import { LoadingScreen } from "./LoadingScreen";
import { Wrapper } from "./Wrapper";

export const UIRoot = () => {
  const layers = useStore((state) => {
    return {
      networkLayer: state.networkLayer,
      phaserLayer: state.phaserLayer,
    };
  });

  if (!layers.networkLayer || !layers.phaserLayer) return <></>;

  return (
    <Wrapper>
      <LoadingScreen />
      <ECSBrowser />
      <Controls />

      <Counter />
    </Wrapper>
  );
};
