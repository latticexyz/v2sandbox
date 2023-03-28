import { useComponentValue } from "@latticexyz/react";
import { sigHash, toBytes16 } from "../utils";
import { useMUD } from "../store";
import { ClickWrapper } from "./theme/ClickWrapper";
import { SpriteImage } from "./theme/SpriteImage";
import { Sprites } from "../layers/phaser/constants";

export const Counter = () => {
  const {
    networkLayer: {
      components: { CounterTable },
      worldContract,
      singletonEntity,
    },
  } = useMUD();

  const counter = useComponentValue(CounterTable, singletonEntity);

  return (
    <ClickWrapper style={{ marginLeft: '10em', marginTop: '10em' }}>
      <div style={{ color: "white" }}>
        Counter: <span>{counter?.value ?? "??"}</span>
      </div>
      <button
        type="button"
        onClick={async (event) => {
          event.preventDefault();

          // NOTE: this will change soon and will be replaced by a more user friendly API
          const txResult = await worldContract.mud_increment_increment({ gasLimit: 1_000_000 });
          await txResult.wait();
        }}
      >
        Add Solider
      </button>
      <SpriteImage spriteKey={Sprites.Soldier} scale={2} />
    </ClickWrapper>
  );
};
