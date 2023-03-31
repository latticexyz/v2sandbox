// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { BoxTable, BoxTableData } from "../tables/BoxTable.sol";
import { PositionTable, PositionTableData } from "../tables/PositionTable.sol";

uint256 constant ID = uint256(keccak256("system.Upload"));
int32 constant N = 1_000_000;

contract UploadSystem is System {
  function upload(
    int32[] memory xs,
    int32[] memory ys,
    int32[] memory zs,
    int32[] memory ws,
    int32[] memory hs,
    int32[] memory ds
  ) public {
    for (uint256 i; i < xs.length; i++) {
      // TODO: generate a proper ID
      bytes32 entityId = bytes32(i);

      BoxTableData memory box = BoxTableData(ws[i], hs[i], ds[i]);
      PositionTableData memory position = PositionTableData(xs[i], ys[i], zs[i]);
      BoxTable.set(entityId, box);
      PositionTable.set(entityId, position);
    }
  }
}
