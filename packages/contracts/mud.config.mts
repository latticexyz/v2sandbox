import { MUDUserConfig } from "@latticexyz/cli";
import { SchemaType } from "@latticexyz/schema-type";

const config = {
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
        value: SchemaType.UINT32,
      },
    },
  },
  deploymentInfoDirectory: "./mud-deployments",
} satisfies MUDUserConfig;

export default config;
