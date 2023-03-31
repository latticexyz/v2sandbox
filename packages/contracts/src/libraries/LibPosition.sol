// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { PositionTableData } from "../tables/PositionTable.sol";

library LibPosition {
  function manhattan(PositionTableData memory a, PositionTableData memory b) internal pure returns (int32) {
    return abs(a.x - b.x) + abs(a.y - b.y);
  }

  function abs(int32 x) internal pure returns (int32) {
    return x >= 0 ? x : -x;
  }
}
