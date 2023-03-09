// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { console } from "forge-std/console.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { PlayerProfile } from "../tables/PlayerProfile.sol";
import { World } from "@latticexyz/world/src/World.sol";

contract PlayerProfileSystem is System {
  function levelUp(uint32 amount) public returns (uint32) {
    uint32 level = PlayerProfile.getLevel(bytes32("singleton"));
    uint32 newLevel = level + amount;
    // TODO: add suport for routes in the autogen tables (right now we just have support for ids)
    World(msg.sender).setRecord("/mud", "/player", new bytes32[](0), abi.encodePacked(uint32(newLevel)));
    return newLevel;
  }

  function setName(string calldata name) public {
    // TODO: add suport for routes in the autogen tables (right now we just have support for ids)
    World(msg.sender).setRecord("/mud", "/player", new bytes32[](0), bytes(name));
  }
}
