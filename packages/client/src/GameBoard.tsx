import React from "react";
import * as THREE from "three";
import { useRef } from "react";
import { Canvas, Color, ThreeElements, useThree } from "@react-three/fiber";
import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { useKeyboardMovement } from "./useKeyboardMovement";
import { EntityID, getComponentValueStrict, Has } from "@latticexyz/recs";
import { useMUD } from "./MUDContext";

function Plane(props: ThreeElements["mesh"]) {
  const ref = useRef<THREE.Mesh>(null!);
  return (
    <mesh {...props} ref={ref}>
      <boxGeometry args={[10, 5, 10]} />
      <meshStandardMaterial color="green" />
    </mesh>
  );
}

function Player(props: ThreeElements["mesh"] & { color: Color }) {
  const ref = useRef<THREE.Mesh>(null!);
  return (
    <mesh {...props} ref={ref}>
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial color={props.color} />
    </mesh>
  );
}

function Scene() {
  const {
    world,
    components: { PositionTable },
    network: { connectedAddress },
  } = useMUD();

  const address = connectedAddress.get();
  if (!address) throw new Error("Not connected");
  const playerEntityId = address as EntityID;
  const playerEntity = world.registerEntity({ id: playerEntityId });

  useKeyboardMovement();

  const playerPosition = useComponentValue(PositionTable, playerEntity);
  const otherPlayers = useEntityQuery([Has(PositionTable)])
    .filter((entity) => entity !== playerEntity)
    .map((entity) => {
      const position = getComponentValueStrict(PositionTable, entity);
      return {
        entity,
        position,
      };
    });

  useThree(({ camera }) => {
    if (playerPosition) {
      camera.position.set(
        playerPosition.x - 5,
        playerPosition.y + 5,
        playerPosition.z + 5
      );
    } else {
      camera.position.set(-5, 5, 5);
    }
    camera.rotation.order = "YXZ";
    camera.rotation.y = -Math.PI / 4;
    camera.rotation.x = Math.atan(-1 / Math.sqrt(2));
  });

  return (
    <group>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Plane position={[0, -5, 0]} />
      {playerPosition ? (
        <Player
          color={Math.floor(
            (parseInt(world.entities[playerEntity]) * 123456) % 16777215
          )}
          position={[playerPosition.x, playerPosition.y, playerPosition.z]}
        />
      ) : null}
      {otherPlayers.map((p, i) => (
        <Player
          key={i}
          color={Math.floor(
            (parseInt(world.entities[p.entity]) * 123456) % 16777215
          )}
          position={[p.position.x, p.position.y, p.position.z]}
        />
      ))}
    </group>
  );
}

export const GameBoard = () => {
  return (
    <Canvas style={{ height: "100vh" }}>
      <Scene />
    </Canvas>
  );
};
