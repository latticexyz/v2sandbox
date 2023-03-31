import { useEntityQuery } from "@latticexyz/react";
import { Has, getComponentValueStrict } from "@latticexyz/recs";
import { useMUD } from "../store";
import { getStringColor } from "@latticexyz/std-client";

export function Leaderboard() {
  const {
    networkLayer: {
      world,
      components: {
        PlayerTable,
        PositionTable,
        HealthTable,
        StrengthTable
      },
    },
  } = useMUD();

  const allPlayers = useEntityQuery([
    Has(PlayerTable),
    Has(PositionTable),
    Has(HealthTable),
    Has(StrengthTable),
  ]);
  const playerData = allPlayers
    .map((player) => {
      const playerAddress = world.entities[player];
      const playerNumber = getComponentValueStrict(PlayerTable, player).value;
      const position = getComponentValueStrict(PositionTable, player);
      const health = getComponentValueStrict(HealthTable, player);
      const strength = getComponentValueStrict(StrengthTable, player).value;

      return {
        player,
        playerAddress,
        position,
        health,
        strength,
        playerNumber,
      };
    })
    .sort((a, b) => {
      return b.strength - a.strength;
    });

  return (
    <div className="absolute left-0 h-screen w-fit flex flex-col items-center justify-around">
      <div>
        {playerData.map((player) => {
          return (
            <div
              style={{
                backgroundColor: `#${getStringColor(
                  player.playerAddress
                ).toString(16)}`,
              }}
              className="flex flex-row p-2 rounded-lg"
            >
              Player {player.playerNumber}: ({player.position.x},{" "}
              {player.position.y})<br />
              Health: {player.health.current} / {player.health.max}
              <br />
              Strength: {player.strength}
            </div>
          );
        })}
      </div>
    </div>
  );
}
