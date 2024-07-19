import { $ } from "../../src";

$.init().then(async ({ startGame }) => {
  await startGame();
});
