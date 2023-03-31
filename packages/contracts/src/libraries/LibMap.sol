// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { PositionTableData } from "../tables/PositionTable.sol";

library LibMap {
  function sqrt(int32 y) internal pure returns (int32 z) {
    if (y > 3) {
      z = y;
      int32 x = y / 2 + 1;
      while (x < z) {
        z = x;
        x = (y / x + x) / 2;
      }
    } else if (y != 0) {
      z = 1;
    }
  }

  function distance(PositionTableData memory from, PositionTableData memory to) internal pure returns (int32) {
    int32 deltaX = from.x > to.x ? from.x - to.x : to.x - from.x;
    int32 deltaZ = from.z > to.z ? from.z - to.z : to.z - from.z;
    return sqrt(deltaX + deltaZ);
  }
}
