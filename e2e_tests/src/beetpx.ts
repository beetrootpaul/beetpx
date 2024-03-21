import { b_ } from "../../src";

b_.init().then(async ({ startGame }) => {
  await startGame();
});
