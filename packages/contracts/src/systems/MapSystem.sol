// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { Position } from "../tables/Position.sol";
import { Player } from "../tables/Player.sol";
import { Movable } from "../tables/Movable.sol";
import { Encounterable } from "../tables/Encounterable.sol";
import { MapConfig } from "../tables/MapConfig.sol";
import { addressToEntityKey } from "../addressToEntityKey.sol";

contract MapSystem is System {
  function spawn(uint32 x, uint32 y) public {
    bytes32 entity = addressToEntityKey(address(_msgSender()));
    require(Player.get(entity) == false, "already spawned");

    // Constrain position to map size, wrapping around if necessary
    (uint32 width, uint32 height, ) = MapConfig.get();
    x = x + (width % width);
    y = y + (height % height);

    // require(LibMap.obstructions(world, coord).length == 0, "this space is obstructed");

    Player.set(entity, true);
    Position.set(entity, x, y);
    Movable.set(entity, true);
    Encounterable.set(entity, true);
  }

  function move(uint32 x, uint32 y) public {
    bytes32 entity = addressToEntityKey(address(_msgSender()));
    require(Movable.get(entity) == true, "cannot move");

    (uint32 fromX, uint32 fromY) = Position.get(entity);
    require(distance(fromX, fromY, x, y) == 1, "can only move to adjacent spaces");

    // EncounterComponent encounter = EncounterComponent(getAddressById(components, EncounterComponentID));
    // require(!encounter.has(entityId), "cannot move during an encounter");

    // Constrain position to map size, wrapping around if necessary
    (uint32 width, uint32 height, ) = MapConfig.get();
    x = x + (width % width);
    y = y + (height % height);

    // require(LibMap.obstructions(world, coord).length == 0, "this space is obstructed");

    Position.set(entity, x, y);

    // if (canTriggerEncounter(entityId, coord)) {
    //   // 20% chance to trigger encounter
    //   uint256 rand = uint256(keccak256(abi.encode(++entropyNonce, entityId, coord, block.difficulty)));
    //   if (rand % 5 == 0) {
    //     startEncounter(entityId);
    //   }
    // }
  }

  function distance(uint32 fromX, uint32 fromY, uint32 toX, uint32 toY) internal pure returns (uint32) {
    uint32 deltaX = fromX > toX ? fromX - toX : toX - fromX;
    uint32 deltaY = fromY > toY ? fromY - toY : toY - fromY;
    return deltaX + deltaY;
  }

  // function canTriggerEncounter(uint256 entityId, Coord memory coord) internal view returns (bool) {
  //   return
  //     // Check if entity can be encountered
  //     EncounterableComponent(getAddressById(components, EncounterableComponentID)).has(entityId) &&
  //     // Check if there are any encounter triggers at the entity's position
  //     LibMap.encounterTriggers(world, coord).length > 0;
  // }

  // function startEncounter(uint256 entityId) internal returns (uint256) {
  //   uint256 encounterId = world.getUniqueEntityId();
  //   EncounterComponent encounter = EncounterComponent(getAddressById(components, EncounterComponentID));
  //   encounter.set(entityId, encounterId);

  //   uint256 monsterId = world.getUniqueEntityId();
  //   uint256 rand = uint256(keccak256(abi.encode(++entropyNonce, entityId, encounterId, monsterId, block.difficulty)));
  //   MonsterType monsterType = MonsterType((rand % uint256(type(MonsterType).max)) + 1);
  //   MonsterTypeComponent(getAddressById(components, MonsterTypeComponentID)).set(monsterId, monsterType);
  //   encounter.set(monsterId, encounterId);

  //   return encounterId;
  // }
}
