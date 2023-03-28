import { EntityID, getComponentValue } from "@latticexyz/recs";
import { useEffect } from "react";
import { useMUD } from "../store";

export const useKeyboardMovement = () => {
  const {
    networkLayer: {
      world,
      worldContract,
      components: { PositionTable },
      network: {
        network: { connectedAddress },
      },
    },
  } = useMUD();

  const moveTo = async (x: number, y: number, z: number) => {
    const txResult = await worldContract.mud_move_move(x, y, z, {
      gasLimit: 1_000_000,
    });
    await txResult.wait();
  };

  const moveBy = async (deltaX: number, deltaY: number, deltaZ: number) => {
    const address = connectedAddress.get();
    if (!address) throw new Error("Not connected");
    const playerEntityId = address as EntityID;
    const playerEntity = world.registerEntity({ id: playerEntityId });

    const playerPosition = getComponentValue(PositionTable, playerEntity);

    if (playerPosition) {
      await moveTo(
        playerPosition.x + deltaX,
        playerPosition.y + deltaY,
        playerPosition.z + deltaZ
      );
    } else {
      await moveTo(deltaX, deltaY, deltaZ);
    }
  };

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        moveBy(1, 0, 0);
      }
      if (e.key === "ArrowDown") {
        moveBy(-1, 0, 0);
      }
      if (e.key === "ArrowLeft") {
        moveBy(0, 0, -1);
      }
      if (e.key === "ArrowRight") {
        moveBy(0, 0, 1);
      }
      if (e.key === " ") {
        moveBy(0, 1, 0);
      }
      if (e.ctrlKey) {
        moveBy(0, -1, 0);
      }
    };

    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [moveBy]);
};
