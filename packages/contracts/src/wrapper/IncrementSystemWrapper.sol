// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { console } from "forge-std/console.sol";
import { IncrementSystem as IncrementSystemSource } from "../systems/IncrementSystem.sol";
import { World } from "@latticexyz/world/src/World.sol";

type SubWorld is address;
using IncrementSystemWrapper for SubWorld global;

/**
 * IncrementSystemWrapper is a wrapper around the IncrementSystem contract,
 * that allows calling it via the World contract but keep the same interface
 * instead of manually encoding/decoding bytes and function selector.
 *
 * This library can easily be auto-generated from the IncrementSystem contract abi and mud.config.mts (for routes).
 *
 * See script/PostDeploy.s.sol for an example of how to use this library.
 */
library IncrementSystemWrapper {
  /**
   * This function has almost the same interface as `IncrementSystem.increment`, but accepts an additional `world` argument
   * that is used to call the IncrementSystem contract.
   */
  function increment(World world) public returns (uint32) {
    bytes memory result = world.call(
      "/mud/increment",
      abi.encodeWithSelector(IncrementSystemSource.increment.selector)
    );
    return abi.decode(result, (uint32));
  }

  /**
   *Optional: We can add another function that accepts a SubWorld instead of a World,
   * which allows us to use a custom type with `using for global`, so the interface for consumers
   * is exactly like calling the `IncrementSystem.increment` function directly.
   */
  function increment(SubWorld world) public returns (uint32) {
    return increment(World(SubWorld.unwrap(world)));
  }
}
