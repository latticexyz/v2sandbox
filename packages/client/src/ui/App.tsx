import { useEffect } from "react";
import { useNetworkLayer } from "./hooks/useNetworkLayer";
import { useStore } from "../store";
import { UIRoot } from "./UIRoot";
import { usePhaserLayer } from "./hooks/usePhaserLayer";

export const App = () => {
  const networkLayer = useNetworkLayer();
  const { phaserLayer } = usePhaserLayer({ networkLayer });

  useEffect(() => {
    if (networkLayer) {
      useStore.setState({ networkLayer });
    }
  }, [networkLayer]);

  useEffect(() => {
    if (phaserLayer) {
      useStore.setState({ phaserLayer });
    }
  }, [phaserLayer]);

  return <UIRoot />;
};
