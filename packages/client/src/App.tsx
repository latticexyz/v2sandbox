import { useComponentValue } from "@latticexyz/react";
import { IWorld__factory } from "../../contracts/types/ethers-contracts/factories/IWorld__factory";
import { useMUD } from "./MUDContext";

export const App = () => {
  const {
    worldContract,
    components: { Position },
    playerEntity,
    playerEntityId,
  } = useMUD();

  console.log("playerEntityId", playerEntityId);
  const position = useComponentValue(Position, playerEntity);

  return (
    <>
      <div>
        Player position: {position?.x}, {position?.y}
      </div>
      <div>
        <button
          type="button"
          onClick={() =>
            worldContract.spawn(5, 5, {
              gasLimit: 1_000_000,
              gasPrice: 0,
            })
          }
        >
          spawn
        </button>
      </div>
    </>
  );
};
