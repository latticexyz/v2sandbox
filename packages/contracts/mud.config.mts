import { mudConfig, resolveTableId } from "@latticexyz/cli";

export default mudConfig({
  overrideSystems: {
    MoveSystem: {
      fileSelector: "move",
      openAccess: true,
    },
  },
  tables: {
    BoxTable: {
      fileSelector: "box",
      schema: {
        width: "int32",
        height: "int32",
        depth: "int32",
      },
    },
    PositionTable: {
      fileSelector: "position",
      schema: {
        x: "int32",
        y: "int32",
        z: "int32",
      },
      storeArgument: true,
    },
    PlayerTable: {
      fileSelector: "player",
      schema: {
        flag: "bool",
      },
    },
  },
  modules: [
    {
      name: "KeysWithValueModule",
      root: true,
      args: [resolveTableId("PositionTable"), resolveTableId("PlayerTable"), resolveTableId("BoxTable")],
    },
  ],
});
