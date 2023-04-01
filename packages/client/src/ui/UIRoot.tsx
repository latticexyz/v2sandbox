import React from "react";
import { useStore } from "../store";
import { AdminControls } from "./AdminControls";
import { ECSBrowser } from "./ECSBrowser";
import { Header } from "./Header";
import { Leaderboard } from "./Leaderboard";
import { LoadingScreen } from "./LoadingScreen";
import { PlayerBar } from "./PlayerBar";
import { Spawn } from "./Spawn";
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
      <AdminControls />

      <Header />

      <Leaderboard />

      <PlayerBar />
      <Spawn />

      <ECSBrowser />
    </Wrapper>
  );
};
