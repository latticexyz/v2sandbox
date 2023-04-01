// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";

import { LibPosition } from "../libraries/LibPosition.sol";

import { PlayerTable } from "../tables/PlayerTable.sol";
import { HealthTable, HealthTableData } from "../tables/HealthTable.sol";
import { StrengthTable } from "../tables/StrengthTable.sol";
import { PositionTable, PositionTableData } from "../tables/PositionTable.sol";
import { MonsterTable } from "../tables/MonsterTable.sol";

import { addressToEntity } from "../Utils.sol";

contract CombatSystem is System {
  function engage(bytes32 defender) public {
    bytes32 attacker = addressToEntity(_msgSender());

    require(PlayerTable.get(attacker) != 0, "Attacker must be a player");

    require(attacker != defender, "Attacker and defender must be different entities");
    require(MonsterTable.get(defender), "Defender must be a monster");

    PositionTableData memory attackerPosition = PositionTable.get(attacker);
    PositionTableData memory defenderPosition = PositionTable.get(defender);
    require(LibPosition.manhattan(attackerPosition, defenderPosition) == 1, "Attacker and defender must be adjacent");

    int32 attackerDamage = StrengthTable.get(attacker);
    int32 defenderDamage = StrengthTable.get(defender);

    HealthTableData memory attackerHealth = HealthTable.get(attacker);
    HealthTableData memory defenderHealth = HealthTable.get(defender);

    if (attackerDamage >= defenderHealth.current) {
      HealthTable.set(defender, HealthTableData(0, defenderHealth.max));
      MonsterTable.deleteRecord(defender);
      PositionTable.deleteRecord(defender);

      // grow stronger after each kill
      HealthTable.set(attacker, HealthTableData(attackerHealth.current, attackerHealth.max + 5));
      StrengthTable.set(attacker, StrengthTable.get(attacker) + 1);
    } else {
      HealthTable.set(defender, HealthTableData(defenderHealth.current - attackerDamage, defenderHealth.max));

      if (defenderDamage >= attackerHealth.current) {
        HealthTable.set(attacker, HealthTableData(0, attackerHealth.max));
        PositionTable.deleteRecord(attacker);
        PlayerTable.deleteRecord(attacker);
      } else {
        HealthTable.set(attacker, HealthTableData(attackerHealth.current - defenderDamage, attackerHealth.max));
      }
    }
  }

  uint32 constant HEAL_AMOUNT = 20;

  function heal() public {
    bytes32 player = addressToEntity(_msgSender());
    require(PlayerTable.get(player) != 0, "must be a player");

    HealthTableData memory playerHealthData = HealthTable.get(player);

    int32 newHealth = playerHealthData.current + int32(HEAL_AMOUNT);
    if (newHealth > playerHealthData.max) {
      newHealth = playerHealthData.max;
    }

    HealthTable.set(player, HealthTableData(newHealth, playerHealthData.max));
  }
}
