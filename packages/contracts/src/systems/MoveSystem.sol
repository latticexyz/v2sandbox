// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { PlayerTable, PlayerTableTableId } from "../tables/PlayerTable.sol";
import { PositionTable, PositionTableData, PositionTableTableId } from "../tables/PositionTable.sol";
import { World } from "@latticexyz/world/src/World.sol";

import { LibMonster } from "../libraries/LibMonster.sol";
import { LibPosition } from "../libraries/LibPosition.sol";

import { addressToEntity } from "../Utils.sol";
import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";

contract MoveSystem is System {
  function move(int32 x, int32 y) public {
    bytes32 player = addressToEntity(_msgSender());

    uint32 existingId = PlayerTable.get(player);
    require(existingId != 0, "Must spawn first");

    bytes32[] memory conflictingPositions = getKeysWithValue(PositionTableTableId, PositionTable.encode(x, y));
    require(conflictingPositions.length == 0, "Position already occupied");

    PositionTableData memory oldCoord = PositionTable.get(player);
    require(LibPosition.manhattan(oldCoord, PositionTableData(x, y)) == 1, "Must move one tile");

    LibMonster.randomlySpawnMonster(player, x, y);

    PositionTable.set(player, x, y);
  }
}
