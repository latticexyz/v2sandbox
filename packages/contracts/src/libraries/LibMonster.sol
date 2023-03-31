// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { MonsterTable } from "../tables/MonsterTable.sol";
import { PositionTable, PositionTableData, PositionTableTableId } from "../tables/PositionTable.sol";
import { StrengthTable } from "../tables/StrengthTable.sol";
import { HealthTable, HealthTableData } from "../tables/HealthTable.sol";

import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";

library LibMonster {
  function randomlySpawnMonster(bytes32 seed, int32 originX, int32 originY) internal {
    bytes32 randomSeed = blockhash(block.number - 1);
    uint256 random = uint256(keccak256(abi.encodePacked(randomSeed, seed, block.timestamp)));
    if (random % 4 == 0) {
      uint256 offsetSeed = uint256(keccak256(abi.encodePacked(randomSeed, seed, block.timestamp, random)));
      uint256 offsetSeed2 = uint256(keccak256(abi.encodePacked(randomSeed, seed, block.timestamp, random, offsetSeed)));
      int32 xOffset = int32(uint32(offsetSeed % 6)) - 3;
      int32 yOffset = int32(uint32(offsetSeed2 % 6)) - 3;

      PositionTableData memory spawnCoord = PositionTableData(originX + xOffset, originY + yOffset);
      bytes32[] memory blockingSpawn = getKeysWithValue(
        PositionTableTableId,
        PositionTable.encode(spawnCoord.x, spawnCoord.y)
      );

      bool invalidPosition = (spawnCoord.x == originX && spawnCoord.y == originY) || blockingSpawn.length > 0;
      if (!invalidPosition) {
        LibMonster.spawnMonsterAt(bytes32(random), originX + xOffset, originY + yOffset);
      }
    }
  }

  function spawnMonsterAt(bytes32 id, int32 x, int32 y) internal {
    MonsterTable.set(id, true);
    PositionTable.set(id, x, y);
    StrengthTable.set(id, 5);
    HealthTable.set(id, HealthTableData(30, 30));
  }
}
