// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "forge-std/Script.sol";

contract PostDeploy is Script {
  function run(address world) external {
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    vm.startBroadcast(deployerPrivateKey);
    console.log("Deployed world: ", world);
    new TestContract().test();
    vm.stopBroadcast();
  }
}

contract TestContract {
  function test() public view {
    console.log(msg.sender);
  }
}
