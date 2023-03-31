// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { BoxTable, BoxTableData } from "../tables/BoxTable.sol";
import { PositionTable, PositionTableData } from "../tables/PositionTable.sol";
import { LibMap } from "../libraries/LibMap.sol";

uint256 constant ID = uint256(keccak256("system.Move"));
int32 constant N = 1_000_000;

contract MoveSystem is System {
  function move(int32 x, int32 z) public {
    bytes32 entityId = bytes32(uint256(uint160((_msgSender()))));

    PositionTableData memory newPosition = PositionTableData(x, 0, z);
    PositionTableData memory currentPosition = PositionTable.get(entityId);

    require(LibMap.distance(currentPosition, newPosition) <= N, "can only move to adjacent spaces");

    PositionTable.set(entityId, newPosition);
  }
}
