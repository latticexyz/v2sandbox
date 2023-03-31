import React from "react";
import * as THREE from "three";
import { useRef } from "react";
import {
  Canvas,
  Color,
  ThreeElements,
  useLoader,
  useThree,
} from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { N, useKeyboardMovement } from "./useKeyboardMovement";
import { EntityID, getComponentValueStrict, Has, Not } from "@latticexyz/recs";
import { useMUD } from "./MUDContext";
import { TextureLoader, Vector3 } from "three";

function Plane(props: ThreeElements["mesh"]) {
  const ref = useRef<THREE.Mesh>(null!);
  const colorMap = useLoader(TextureLoader, "grass.png");

  return (
    <mesh {...props} ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial attach="material" map={colorMap} />
    </mesh>
  );
}

function Post(
  props: ThreeElements["mesh"] & {
    dimensions: { width: number; height: number; depth: number };
  }
) {
  const ref = useRef<THREE.Mesh>(null!);
  return (
    <mesh {...props} ref={ref}>
      <boxGeometry
        args={[
          props.dimensions.width,
          props.dimensions.height,
          props.dimensions.depth,
        ]}
      />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}

function Sphere(props: ThreeElements["mesh"]) {
  const ref = useRef<THREE.Mesh>(null!);
  return (
    <mesh {...props} ref={ref}>
      <sphereGeometry args={[10]} />
      <meshStandardMaterial color="purple" />
    </mesh>
  );
}

function Player(props: ThreeElements["mesh"] & { color: Color }) {
  const ref = useRef<THREE.Mesh>(null!);
  return (
    <mesh {...props} ref={ref}>
      <capsuleGeometry args={[2 / Math.PI, 1.5]} />
      <meshStandardMaterial color={props.color} />
    </mesh>
  );
}

const fix = (vector: Vector3) => {
  return new Vector3(vector.x, vector.y, vector.z).divideScalar(N);
};

const RANGE = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];

function Scene() {
  const {
    world,
    components: { BoxTable, PositionTable, PlayerTable },
    network: { connectedAddress },
  } = useMUD();

  const address = connectedAddress.get();
  if (!address) throw new Error("Not connected");
  const playerEntityId = address as EntityID;
  const playerEntity = world.registerEntity({ id: playerEntityId });

  const playerPosition = useComponentValue(PositionTable, playerEntity);
  const players = useEntityQuery([Has(PositionTable), Has(PlayerTable)]).map(
    (entity) => {
      const position = getComponentValueStrict(PositionTable, entity);
      return {
        entity,
        position,
      };
    }
  );
  const colliders = useEntityQuery([
    Has(BoxTable),
    Has(PositionTable),
    Not(PlayerTable),
  ]).map((entity) => {
    const box = getComponentValueStrict(BoxTable, entity);
    const position = getComponentValueStrict(PositionTable, entity);
    return {
      entity,
      box,
      position,
    };
  });

  useThree(({ camera }) => {
    if (playerPosition) {
      const divided = fix(playerPosition);
      camera.position.set(divided.x, divided.y + 0.5, divided.z);
    } else {
      camera.position.set(-5, 5, 5);
    }
  });

  const { camera } = useThree();

  useKeyboardMovement(camera);

  return (
    <group>
      <ambientLight />
      <PointerLockControls
        position={playerPosition ? fix(playerPosition) : [0, 0, 0]}
      />
      <pointLight position={[10, 10, 10]} />
      <Sphere position={[-5, 10, -30]} />
      {RANGE.map((x) =>
        RANGE.map((z) => <Plane key={`${x}-${z}`} position={[x, -1.5, z]} />)
      )}
      {colliders.map((p, i) => (
        <Post key={i} position={fix(p.position)} dimensions={p.box} />
      ))}
      {players.map((p, i) => (
        <Player
          key={i}
          color={Math.floor(
            (parseInt(world.entities[p.entity]) * 123456) % 16777215
          )}
          position={fix(p.position)}
        />
      ))}
    </group>
  );
}

export const GameBoard = () => {
  const {
    world,
    worldSend,
    components: { PlayerTable },
    network: { connectedAddress, signer },
  } = useMUD();

  const address = connectedAddress.get();
  if (!address) throw new Error("Not connected");
  const playerEntityId = address as EntityID;
  const playerEntity = world.registerEntity({ id: playerEntityId });

  const isPlayer = useComponentValue(PlayerTable, playerEntity);

  return isPlayer ? (
    <Canvas style={{ height: "100vh" }}>
      <Scene />
    </Canvas>
  ) : (
    <div
      style={{ border: "solid" }}
      onClick={async () => {
        // Create a World contract instance
        const s = signer.get();
        if (!s) throw new Error("No signer");

        const txResult = await worldSend("register", []);
        await txResult.wait();
      }}
    >
      Click me to spawn
    </div>
  );
};
