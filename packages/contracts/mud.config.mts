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
      access: [resolveAddress("IncrementSystem")],
    },
  },
  tables: {
    CounterTable: {
      fileSelector: "counter",
      schema: {
        value: SchemaType.UINT32,
      },
      modules: ["ReverseMappingModule"],
    },
  },
  modules: [{ name: "ReverseMappingModule", args: [resolveResourceSelector("CounterTable")], root: true }],
  deploymentInfoDirectory: "./mud-deployments",
} satisfies MUDUserConfig;

export default config;

function resolveResourceSelector(name: string) {
  return { type: "resolveResourceSelector", value: name };
}

function resolveAddress(name: string) {
  return { type: "resolveAddress", value: name };
}
