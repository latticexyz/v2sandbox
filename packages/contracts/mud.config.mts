import { MUDUserConfig } from "@latticexyz/cli";
import { SchemaType } from "@latticexyz/schema-type";

const skystrife = {
  ItemType: "ItemTypes",
  AuraEmitter: SchemaType.INT32,
  AuraStaminaMod: SchemaType.INT32,
}

const movingCastles = {
  Position: {
    schema: {
      x: SchemaType.INT32,
      y: SchemaType.INT32,
    },
  },
  Matter: SchemaType.UINT32,
  Portable: SchemaType.BOOL,
  Substance: SchemaType.UINT32,
}

const darkSeasCannon = {
  Cannon: SchemaType.UINT256,
  OwnedBy: SchemaType.UINT256,
  Rotation: SchemaType.UINT32,
  Firepower: SchemaType.UINT32,
  Range: SchemaType.UINT32,
}

const darkSeasShip = {
  Ship: SchemaType.UINT256,
  Position: {
    schema: {
      x: SchemaType.INT32,
      y: SchemaType.INT32,
    },
  },
  Rotation: SchemaType.UINT32,
  SailPosition: SchemaType.UINT32,
  OwnedBy: SchemaType.UINT256,
  Speed: SchemaType.UINT32,
  Length: SchemaType.UINT32,
  Health: SchemaType.UINT32,
  MaxHealth: SchemaType.UINT32,
  Kills: SchemaType.UINT32,
  Booty: SchemaType.UINT256,
  LastHit: SchemaType.UINT256,
}

const config: MUDUserConfig = {
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
        value: SchemaType.UINT32,
      },
    },

    ...skystrife,
    ...movingCastles,
    ...darkSeasCannon,
    ...darkSeasShip,
  },
  deploymentInfoDirectory: "./mud-deployments",

  prototypes: {
    // skystrife
    StaminaBanner: {
      directory: "prototypes/skystrife",
      tables: {
        ItemType: {default: "ItemTypes.StaminaBanner"},
        AuraEmitter: {default: "0"},
        AuraStaminaMod: {default: "500"}
      }
    },
    // moving castles
    SubstanceBlock: {
      directory: "prototypes/moving-castles",
      tables: {
        Position: {},
        Matter: {},
        Portable: {default: "true"},
        Substance: {default: "100"},
      }
    },
    // dark seas
    ShipPrototype: {
      directory: "prototypes/dark-seas",
      tables: {
        Ship: {},
        Position: {},
        Rotation: {},
        SailPosition: {default: "2"},
        OwnedBy: {},
        Speed: {},
        Length: {},
        Health: {},
        MaxHealth: {},
        Kills: {default: "0"},
        Booty: {},
        LastHit: {default: "0x60D"},
      }
    },
    CannonPrototype: {
      directory: "prototypes/dark-seas",
      tables: {
        Cannon: {},
        OwnedBy: {},
        Rotation: {},
        Firepower: {},
        Range: {},
      }
    }
  },

  userTypes: {
    enums: {
      ItemTypes: ["Unknown", "Gold", "EmberCrown", "BlazingHeart", "MovementBanner", "SwordBanner", "StaminaBanner", "Crystal", "Metal", "Fossil", "Widget"],
    }
  }
};

export default config;
