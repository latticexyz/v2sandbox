import { useComponentValue } from "@latticexyz/react";
import { sigHash, toBytes16 } from "../utils";
import { useMUD } from "../store";
import { ClickWrapper } from "./theme/ClickWrapper";

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
    <ClickWrapper>
      <div style={{ color: "white" }}>
        Counter: <span>{counter?.value ?? "??"}</span>
      </div>
      <button
        type="button"
        onClick={async (event) => {
          event.preventDefault();

          // NOTE: this will change soon and will be replaced by a more user friendly API
          const txResult = await worldContract["call"](
            toBytes16("mud"),
            toBytes16("increment"),
            sigHash("increment()"),
            {
              gasPrice: 0,
              gasLimit: 1_000_000,
            }
          );

          console.log(txResult);
          console.log(await txResult.wait());
        }}
      >
        Increment
      </button>
    </ClickWrapper>
  );
};
