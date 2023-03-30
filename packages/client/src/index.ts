import { setup } from "./mud/setup";

const { components, worldContract, fastTxExecute } = await setup();

// Components expose a stream that triggers when the component is updated.
components.CounterTable.update$.subscribe((update) => {
  const [nextValue, prevValue] = update.value;
  console.log("Counter updated", update, { nextValue, prevValue });
  document.getElementById("counter")!.innerHTML = String(
    nextValue?.value ?? "unset"
  );
});

// Just for demonstration purposes: we create a global function that can be
// called to invoke the Increment system contract via the world. (See IncrementSystem.sol.)
(window as any).incrementFast = async () => {
  const time = Date.now();

  const fastTx = fastTxExecute(worldContract, "mud_increment_increment", [
    { gasLimit: 300_000 },
  ]);

  fastTx
    .then((t) => {
      console.log("fastTx", t);
      console.log("fastTx time till sending tx", Date.now() - time, "ms");
      return t.tx;
    })
    .then(async (t) => {
      console.log("t", t);
      const result = await t.wait();
      console.log("fastTx result", result);
      console.log("fastTx time till result", Date.now() - time, "ms");
    });
};

(window as any).incrementRegular = async () => {
  const time = Date.now();
  const regularTx = worldContract.mud_increment_increment({
    gasLimit: 300_000,
  });

  regularTx
    .then((t) => {
      console.log("regularTx", t);
      console.log("regularTx time till sending tx", Date.now() - time, "ms");
      return t;
    })
    .then(async (t) => {
      const result = await t.wait(0);
      console.log("regularTx result", result);
      console.log("regularTx time till result", Date.now() - time, "ms");
    });
};
