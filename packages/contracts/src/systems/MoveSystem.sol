// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { PositionTable, PositionTableData } from "../tables/PositionTable.sol";
import { World } from "@latticexyz/world/src/World.sol";
import { LibMap } from "../libraries/LibMap.sol";

uint256 constant ID = uint256(keccak256("system.Move"));

contract MoveSystem is System {
  function move(int32 x, int32 y, int32 z) public {
    bytes32 entityId = bytes32(uint256(uint160((_msgSender()))));

    PositionTableData memory position = PositionTable.get(entityId);
    PositionTableData memory newPosition = PositionTableData(x, y, z);

    require(LibMap.distance(position, newPosition) == 1, "can only move to adjacent spaces");

    PositionTable.set(entityId, newPosition);
  }
}
