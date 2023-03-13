import { World } from "@latticexyz/recs";
import { World as WorldContract } from "@latticexyz/world/types/ethers-contracts/World";
import { useComponentValue } from "@latticexyz/react";
import { components, singletonIndex } from ".";
import { sigHash, toBytes16 } from "./utils";

type Props = {
  world: World;
  worldContract: WorldContract;
  components: typeof components;
};

export const App = ({ worldContract, components }: Props) => {
  const counter = useComponentValue(components.Counter, singletonIndex);
  return (
    <>
      <div>
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
    </>
  );
};
