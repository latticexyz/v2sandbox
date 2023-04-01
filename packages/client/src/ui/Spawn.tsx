import { useMUD } from "../store";
import { useActionButton } from "./hooks/useActionButton";
import { useCurrentPlayer } from "./hooks/useCurrentPlayer";
import { ClickWrapper } from "./theme/ClickWrapper";

export function Spawn() {
  const {
    networkLayer: {
      utils: {
        txApi: { spawnPlayer },
      },
    },
  } = useMUD();

  const { button: spawnButton } = useActionButton({
    label: "Spawn",
    actionName: "spawnPlayer",
    actionFunction: spawnPlayer,
    className: "text-2xl"
  });

  const currentPlayer = useCurrentPlayer();
  if (currentPlayer) return <></>;

  return (
    <ClickWrapper className="w-screen h-screen flex flex-col justify-around items-center">
      <div>
        {spawnButton}
      </div>
    </ClickWrapper>
  );
}
