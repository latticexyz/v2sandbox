import { IWorld__factory } from "../../contracts/types/ethers-contracts/factories/IWorld__factory";
import { setup } from "./mud/setup";

const { components, networkConfig, network } = await setup();

// Create a World contract instance
const signer = network.signer.get();
if (!signer) throw new Error("No signer");

const worldContract = IWorld__factory.connect(
  networkConfig.worldAddress,
  signer
);

// Just for demonstration purposes: we create a global function that can be
// called to invoke the Increment system contract via the world. (See IncrementSystem.sol.)
(window as any).spawn = async () => {
  const txResult = await worldContract.spawn(5, 5, {
    gasLimit: 1_000_000,
    gasPrice: 0,
  });

  console.log(txResult);
  console.log(await txResult.wait());
};
