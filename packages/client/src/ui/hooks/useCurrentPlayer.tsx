import { EntityID, EntityIndex } from "@latticexyz/recs";
import { useEffect, useState } from "react";
import { useMUD } from "../../store";

export const useCurrentPlayer = () => {
  const {
    networkLayer: {
      utils: { onPlayerLoaded },
    },
  } = useMUD();

  const [playerData, setPlayerData] = useState<{
    player: EntityIndex;
    playerId: EntityID;
  } | null>(null);

  useEffect(() => {
    onPlayerLoaded((data) => {
      setPlayerData(data);
    });
  }, [onPlayerLoaded]);

  return playerData;
};
