import { mudConfig } from "@latticexyz/cli";

export default mudConfig({
  excludeSystems: ["System3", "System2"],
  worldContractName: "CustomWorld",
  namespace: "mud",
  overrideSystems: {
    IncrementSystem: {
      fileSelector: "increment",
      openAccess: true,
      enableCallStream: true,
    },
  },
  tables: {
    CounterTable: {
      fileSelector: "counter",
      schema: {
        value: "uint32",
      },
    },
  },
  deploymentInfoDirectory: "./mud-deployments",
});
