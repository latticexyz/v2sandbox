// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { World } from "@latticexyz/world/src/World.sol";

import { PlayerTable, PlayerTableTableId } from "../tables/PlayerTable.sol";
import { PositionTable, PositionTableTableId } from "../tables/PositionTable.sol";
import { HealthTable, HealthTableData } from "../tables/HealthTable.sol";
import { StrengthTable } from "../tables/StrengthTable.sol";

import { addressToEntity } from "../Utils.sol";
import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";

contract PlayerSystem is System {
  function spawn(uint32 id, int32 x, int32 y) public {
    bytes32 player = addressToEntity(_msgSender());

    require(id != 0, "Invalid player ID");

    uint32 existingId = PlayerTable.get(player);
    require(existingId == 0, "Address already spawned");

    bytes32[] memory conflictingPlayerIds = getKeysWithValue(PlayerTableTableId, PlayerTable.encode(id));
    require(conflictingPlayerIds.length == 0, "Player ID already exists");

    bytes32[] memory conflictingPositions = getKeysWithValue(PositionTableTableId, PositionTable.encode(x, y));
    require(conflictingPositions.length == 0, "Position already occupied");

    PlayerTable.set(player, id);
    PositionTable.set(player, x, y);
    HealthTable.set(player, HealthTableData(100, 100));
    StrengthTable.set(player, 10);
  }
}
