// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { PlayerTable } from "../tables/PlayerTable.sol";
import { BoxTable, BoxTableData } from "../tables/BoxTable.sol";
import { PositionTable, PositionTableData } from "../tables/PositionTable.sol";

uint256 constant ID = uint256(keccak256("system.Register"));

contract RegisterSystem is System {
  function register() public {
    bytes32 entityId = bytes32(uint256(uint160((_msgSender()))));

    PlayerTable.set(entityId, true);
    BoxTable.set(entityId, BoxTableData(1, 2, 1));
    PositionTable.set(entityId, PositionTableData(0, 0, 0));
  }
}
