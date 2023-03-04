import { MUDUserConfig } from "@latticexyz/cli";
import { SchemaType } from "@latticexyz/schema-type";

const config: MUDUserConfig = {
  excludeSystems: ["System3", "System2"],
  overrideSystems: {
    System: {
      route: "/system",
      openAccess: false,
      accessList: ["IncrementSystem"],
    },
  },
  tables: {
    CounterTable: {
      route: "/counter",
      schema: {
        value: SchemaType.UINT32,
      },
    },
  },
  deploymentInfoDirectory: "./asdf",
};

export default config;
