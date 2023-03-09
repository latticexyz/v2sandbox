import { MUDUserConfig } from "@latticexyz/cli";
import { SchemaType } from "@latticexyz/schema-type";

const config: MUDUserConfig = {
  excludeSystems: ["System3", "System2"],
  worldContractName: "CustomWorld",
  overrideSystems: {
    IncrementSystem: {
      route: "/mud/increment",
      openAccess: true,
    },
  },
  tables: {
    CounterTable: {
      route: "/mud/counter",
      schema: {
        value: SchemaType.UINT32,
      },
    },
    PlayerProfile: {
      route: "/mud/player",
      schema: {
        level: SchemaType.UINT32,
        name: SchemaType.STRING,
      },
    },
  },
  deploymentInfoDirectory: "./mud-deployments",
};

export default config;
