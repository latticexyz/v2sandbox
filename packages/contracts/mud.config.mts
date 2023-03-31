import { mudConfig, resolveTableId } from "@latticexyz/cli";

export default mudConfig({
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
