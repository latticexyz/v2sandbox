import { StoreUserConfig } from "@latticexyz/cli";
import { SchemaType } from "@latticexyz/schema-type";

const config: StoreUserConfig = {
  tables: {
    CounterTable: {
      schema: {
        value: SchemaType.UINT32,
      },
    },
  },
};

export default config;
