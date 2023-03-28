import { mudConfig, resolveTableId } from "@latticexyz/cli";

export default mudConfig({
  deploysDirectory: "./deploys",
  excludeSystems: ["System3", "System2"],
  worldContractName: "CustomWorld",
  namespace: "mud",
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
