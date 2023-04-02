import { useComponentValue } from "@latticexyz/react";
import { useMUD } from "../store";
import { ClickWrapper } from "./theme/ClickWrapper";
import { SpriteImage } from "./theme/SpriteImage";
import { Sprites } from "../layers/phaser/constants";

export const Counter = () => {
  const {
    networkLayer: {
      components: { CounterTable },
      worldSend,
      singletonEntity,
    },
  } = useMUD();

  const counter = useComponentValue(CounterTable, singletonEntity);

  return (
    <ClickWrapper style={{ marginLeft: "10em", marginTop: "10em" }}>
      <div style={{ color: "white" }}>
        Counter: <span>{counter?.value ?? "??"}</span>
      </div>
      <button
        type="button"
        onClick={async (event) => {
          event.preventDefault();
          worldSend("increment", [{ gasLimit: 1_000_000 }]);
        }}
      >
        Add Solider
      </button>
      <SpriteImage spriteKey={Sprites.Soldier} scale={2} />
    </ClickWrapper>
  );
};
