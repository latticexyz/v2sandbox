import { setupMUDV2Network } from "@latticexyz/std-client";
import { createFaucetService } from "@latticexyz/network";
import { getNetworkConfig } from "./getNetworkConfig";
import { defineContractComponents } from "./contractComponents";
import { clientComponents } from "./clientComponents";
import { world } from "./world";
import { utils } from "ethers";
import { IWorld__factory } from "../../../contracts/types/ethers-contracts/factories/IWorld__factory";
import {
  getComponentValue,
  Has,
  HasValue,
  overridableComponent,
  runQuery,
} from "@latticexyz/recs";
import { awaitStreamValue, uuid } from "@latticexyz/utils";

export type SetupResult = Awaited<ReturnType<typeof setup>>;

export async function setup() {
  const contractComponents = defineContractComponents(world);
  const networkConfig = await getNetworkConfig();
  const result = await setupMUDV2Network<typeof contractComponents>({
    networkConfig,
    world,
    contractComponents,
    syncThread: "main",
  });

  result.startSync();

  // Request drip from faucet
  const signer = result.network.signer.get();
  if (!networkConfig.devMode && networkConfig.faucetServiceUrl && signer) {
    const address = await signer.getAddress();
    console.info("[Dev Faucet]: Player address -> ", address);

    const faucet = createFaucetService(networkConfig.faucetServiceUrl);

    const requestDrip = async () => {
      const balance = await signer.getBalance();
      console.info(`[Dev Faucet]: Player balance -> ${balance}`);
      const lowBalance = balance?.lte(utils.parseEther("1"));
      if (lowBalance) {
        console.info("[Dev Faucet]: Balance is low, dripping funds to player");
        // Double drip
        await faucet.dripDev({ address });
        await faucet.dripDev({ address });
      }
    };

    requestDrip();
    // Request a drip every 20 seconds
    setInterval(requestDrip, 20000);
  }

  const worldContract = IWorld__factory.connect(
    networkConfig.worldAddress,
    signer || result.network.providers.get().json
  );

  const components = {
    ...result.components,
    Position: overridableComponent(result.components.Position),
    Player: overridableComponent(result.components.Player),
    ...clientComponents,
  };

  const wrapPosition = (x: number, y: number) => {
    const mapConfig = getComponentValue(
      components.MapConfig,
      result.singletonEntity
    );
    if (!mapConfig) {
      throw new Error("mapConfig no yet loaded or initialized");
    }
    return [
      (x + mapConfig.width) % mapConfig.width,
      (y + mapConfig.height) % mapConfig.height,
    ];
  };

  const isObstructed = (x: number, y: number) => {
    return (
      runQuery([
        Has(components.Obstruction),
        HasValue(components.Position, { x, y }),
      ]).size > 0
    );
  };

  const moveTo = async (x: number, y: number) => {
    if (!result.playerEntity) {
      throw new Error("no player");
    }

    const [wrappedX, wrappedY] = wrapPosition(x, y);
    if (isObstructed(wrappedX, wrappedY)) {
      console.warn("cannot move to obstructed space");
      return;
    }

    const inEncounter =
      getComponentValue(components.Encounter, result.playerEntity)?.value !=
      null;
    if (inEncounter) {
      console.warn("cannot move while in encounter");
      return;
    }

    const positionId = uuid();
    components.Position.addOverride(positionId, {
      entity: result.playerEntity,
      value: { x: wrappedX, y: wrappedY },
    });

    try {
      // Our system checks distance on the original/requested x,y and then wraps for us,
      // so we'll pass the original x,y here.
      // TODO: make the contract smarter about calculating wrapped distance
      const tx = await worldContract.move(x, y, { gasPrice: 0 });
      await awaitStreamValue(result.txReduced$, (txHash) => txHash === tx.hash);
    } finally {
      components.Position.removeOverride(positionId);
    }
  };

  const moveBy = async (deltaX: number, deltaY: number) => {
    if (!result.playerEntity) {
      throw new Error("no player");
    }

    const playerPosition = getComponentValue(
      components.Position,
      result.playerEntity
    );
    if (!playerPosition) {
      console.warn("cannot moveBy without a player position, not yet spawned?");
      return;
    }

    await moveTo(playerPosition.x + deltaX, playerPosition.y + deltaY);
  };

  const spawn = async (x: number, y: number) => {
    if (!result.playerEntity) {
      throw new Error("no player");
    }

    const canSpawn =
      getComponentValue(components.Player, result.playerEntity)?.value !== true;
    if (!canSpawn) {
      throw new Error("already spawned");
    }

    const [wrappedX, wrappedY] = wrapPosition(x, y);
    if (isObstructed(wrappedX, wrappedY)) {
      console.warn("cannot spawn on obstructed space");
      return;
    }

    const positionId = uuid();
    components.Position.addOverride(positionId, {
      entity: result.playerEntity,
      value: { x: wrappedX, y: wrappedY },
    });
    const playerId = uuid();
    components.Player.addOverride(playerId, {
      entity: result.playerEntity,
      value: { value: true },
    });

    try {
      const tx = await worldContract.spawn(wrappedX, wrappedY, { gasPrice: 0 });
      await awaitStreamValue(result.txReduced$, (txHash) => txHash === tx.hash);
    } finally {
      components.Position.removeOverride(positionId);
      components.Player.removeOverride(playerId);
    }
  };

  return {
    ...result,
    components,
    worldContract,
    api: {
      moveTo,
      moveBy,
      spawn,
    },
  };
}
