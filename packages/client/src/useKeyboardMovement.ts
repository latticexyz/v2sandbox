import { EntityID, getComponentValue } from "@latticexyz/recs";
import { Camera } from "@react-three/fiber";
import { useEffect } from "react";
import { Vector3 } from "three";
import { useMUD } from "./MUDContext";

export const N = 1_000_000;

export const useKeyboardMovement = (camera: Camera) => {
  const {
    world,
    components: { PositionTable },
    network: { connectedAddress, signer },
    worldSend,
  } = useMUD();

  const moveTo = async (vector: Vector3) => {
    // Create a World contract instance
    const s = signer.get();
    if (!s) throw new Error("No signer");

    const txResult = await worldSend("move", [vector.x, vector.z]);
    await txResult.wait();
  };

  const moveBy = async (delta: Vector3) => {
    const address = connectedAddress.get();
    if (!address) throw new Error("Not connected");
    const playerEntityId = address as EntityID;
    const playerEntity = world.registerEntity({ id: playerEntityId });

    const playerPosition = getComponentValue(PositionTable, playerEntity);

    const norm = delta.normalize();
    const floored = new Vector3(
      Math.round(norm.x * N),
      Math.round(norm.y * N),
      Math.round(norm.z * N)
    );
    if (playerPosition) {
      await moveTo(floored.add(playerPosition as Vector3));
    }
  };

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      const vector = camera.getWorldDirection(new Vector3());
      var axis = new Vector3(0, 1, 0);

      if (e.key === "w") {
        moveBy(camera.getWorldDirection(new Vector3()));
      } else if (e.key === "a") {
        var angle = Math.PI / 2;

        vector.applyAxisAngle(axis, angle);

        moveBy(vector);
      } else if (e.key === "d") {
        var angle = -Math.PI / 2;

        vector.applyAxisAngle(axis, angle);

        moveBy(vector);
      } else if (e.key === "s") {
        var angle = Math.PI;

        vector.applyAxisAngle(axis, angle);

        moveBy(vector);
      }
    };

    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [moveBy, camera]);
};
