import { mudConfig, resolveTableId } from "@latticexyz/cli";

export default mudConfig({
  overrideSystems: {
    MoveSystem: {
      fileSelector: "move",
      openAccess: true,
    },
  },
  tables: {
    PositionTable: {
      fileSelector: "position",
      schema: {
        x: "int32",
        y: "int32",
        z: "int32",
      },
      storeArgument: true,
    },
  },
  modules: [
    {
      name: "KeysWithValueModule",
      root: true,
      args: [resolveTableId("PositionTable")],
    },
  ],
});
