// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "forge-std/Script.sol";
import { N } from "../src/systems/MoveSystem.sol";
import { UploadSystem } from "../src/systems/UploadSystem.sol";
import { IWorld } from "../src/world/IWorld.sol";
import { BoxTableData } from "../src/tables/BoxTable.sol";

contract PostDeploy is Script {
  function run(address worldAddress) external {
    // Load the private key from the `PRIVATE_KEY` environment variable (in .env)
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

    // Start broadcasting transactions from the deployer account
    vm.startBroadcast(deployerPrivateKey);

    // TODO: make an actual file format for this
    int32[] memory xs = new int32[](2);
    int32[] memory ys = new int32[](2);
    int32[] memory zs = new int32[](2);
    int32[] memory hs = new int32[](2);
    int32[] memory ws = new int32[](2);
    int32[] memory ds = new int32[](2);
    xs[0] = 5 * N;
    ys[0] = 3 * N;
    zs[0] = 4 * N;
    ws[0] = 5;
    hs[0] = 10;
    ds[0] = 2;
    xs[1] = -4 * N;
    ys[1] = 2 * N;
    zs[1] = 4 * N;
    ws[1] = 4;
    hs[1] = 4;
    ds[1] = 4;

    IWorld world = IWorld(worldAddress);
    world.upload(xs, ys, zs, ws, hs, ds);

    vm.stopBroadcast();
  }
}

contract TestContract {
  function test() public view {
    console.log(msg.sender);
  }
}
