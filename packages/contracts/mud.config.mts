import { mudConfig, resolveTableId } from "@latticexyz/cli";

export default mudConfig({
  deploysDirectory: "./deploys",
  excludeSystems: ["System3", "System2"],
  worldContractName: "CustomWorld",
  namespace: "mud",
  overrideSystems: {
    IncrementSystem: {
      fileSelector: "increment",
      openAccess: true,
    },
  },
  tables: {
    CounterTable: {
      fileSelector: "counter",
      schema: {
        value: "uint32",
      },
      storeArgument: true,
    },
  },
  modules: [
    {
      name: "KeysWithValueModule",
      root: true,
      args: [resolveTableId("CounterTable")],
    },
  ],
});
