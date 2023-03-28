import React, { useMemo, useRef, useState } from "react";
import { createPhaserLayer } from "../../layers/phaser/createPhaserLayer";
import { NetworkLayer } from "../../layers/network/createNetworkLayer";
import { usePromiseValue } from "./usePromiseValue";
import { phaserConfig } from "../../layers/phaser/configurePhaser";

const createContainer = () => {
  const container = document.createElement("div");
  container.style.width = "100%";
  container.style.height = "100%";
  container.style.pointerEvents = "all";
  container.style.overflow = "hidden";
  return container;
};

type Props = {
  networkLayer: NetworkLayer | null;
};

export const usePhaserLayer = ({ networkLayer }: Props) => {
  const parentRef = useRef<HTMLElement | null>(null);
  const [{ width, height }] = useState({ width: 0, height: 0 });

  const { phaserLayerPromise } = useMemo(() => {
    if (!networkLayer) return { phaserLayerPromise: null, container: null };

    const container = createContainer();
    if (parentRef.current) {
      parentRef.current.appendChild(container);
    }

    return {
      container,
      phaserLayerPromise: createPhaserLayer(networkLayer, {
        ...phaserConfig,
        scale: {
          ...phaserConfig.scale,
          parent: container,
          mode: Phaser.Scale.NONE,
          width,
          height,
        },
      }),
    };

    // We don't want width/height to recreate phaser layer, so we ignore linter
  }, [networkLayer]);

  const phaserLayer = usePromiseValue(phaserLayerPromise);

  return useMemo(() => ({ phaserLayer }), [phaserLayer]);
};
