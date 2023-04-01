// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { PositionTableData } from "../tables/PositionTable.sol";

library LibMap {
  function distance(PositionTableData memory from, PositionTableData memory to) internal pure returns (int32) {
    int32 deltaX = from.x > to.x ? from.x - to.x : to.x - from.x;
    int32 deltaY = from.y > to.y ? from.y - to.y : to.y - from.y;
    int32 deltaZ = from.z > to.z ? from.z - to.z : to.z - from.z;
    return deltaX + deltaY + deltaZ;
  }
}
