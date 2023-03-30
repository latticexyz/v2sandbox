import { mudConfig, resolveTableId } from "@latticexyz/cli";

export default mudConfig({
  deploysDirectory: "./deploys",
  // worldContractName: "CustomWorld",
  // namespace: "emojimon",
  // overrideSystems: {
  //   IncrementSystem: {
  //     fileSelector: "increment",
  //     openAccess: true,
  //   },
  // },
  enums: {
    MonsterType: ["None", "Eagle", "Rat", "Caterpillar"],
    TerrainType: ["None", "TallGrass", "Boulder"],
  },
  tables: {
    Counter: {
      storeArgument: true,
      schema: "uint256",
    },
    Encounter: {
      storeArgument: true,
      schema: "uint256",
    },
    EncounterTrigger: {
      storeArgument: true,
      schema: "bool",
    },
    Encounterable: {
      storeArgument: true,
      schema: "bool",
    },
    MapConfig: {
      primaryKeys: {},
      storeArgument: true,
      dataStruct: false,
      schema: {
        width: "uint32",
        height: "uint32",
        terrain: "bytes",
      },
    },
    Monster: {
      storeArgument: true,
      schema: "MonsterType",
    },
    Movable: {
      storeArgument: true,
      schema: "bool",
    },
    Obstruction: {
      storeArgument: true,
      schema: "bool",
    },
    OwnedBy: {
      storeArgument: true,
      schema: "bytes32",
    },
    Player: {
      storeArgument: true,
      schema: "bool",
    },
    Position: {
      storeArgument: true,
      schema: {
        x: "uint32",
        y: "uint32",
      },
    },
  },
  // modules: [
  //   {
  //     name: "KeysWithValueModule",
  //     root: true,
  //     args: [resolveTableId("CounterTable")],
  //   },
  // ],
});
