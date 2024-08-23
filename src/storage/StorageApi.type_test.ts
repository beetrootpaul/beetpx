import { BeetPx } from "../BeetPx";

//
// context: BpxPersistedStateValueConstraints
// test:    types allowed and disallowed by BpxPersistedStateValueConstraints
//

{
  // @ts-expect-error
  BeetPx.savePersistedState(undefined);
  // @ts-expect-error
  BeetPx.savePersistedState(null);
  // @ts-expect-error
  BeetPx.savePersistedState(true);
  // @ts-expect-error
  BeetPx.savePersistedState(123);
  // @ts-expect-error
  BeetPx.savePersistedState("xyz");

  BeetPx.savePersistedState({ abc: undefined });
  BeetPx.savePersistedState({ abc: null });
  BeetPx.savePersistedState({ abc: true });
  BeetPx.savePersistedState({ abc: 123 });
  BeetPx.savePersistedState({ abc: "xyz" });

  // @ts-expect-error
  BeetPx.savePersistedState({ abc: { def: undefined } });
  // @ts-expect-error
  BeetPx.savePersistedState({ abc: { def: null } });
  // @ts-expect-error
  BeetPx.savePersistedState({ abc: { def: true } });
  // @ts-expect-error
  BeetPx.savePersistedState({ abc: { def: 123 } });
  // @ts-expect-error
  BeetPx.savePersistedState({ abc: { def: "xyz" } });
}

//
// context: BpxPersistedStateValueConstraints
// test:    everything can be optional when loaded, in case other shape was
//          stored at one point in time, then the game got updated with a
//          support for new values to be stored as well
//

{
  type MyPersistedState = {
    abc: string;
    def: string;
    ghi?: string;
  };

  const loaded = BeetPx.loadPersistedState<MyPersistedState>();
  if (loaded) {
    // @ts-expect-error - `abc` should be possibly undefined here
    const abc2: string = loaded.abc;
    // @ts-expect-error - `def` should be possibly undefined here
    const def2: string = loaded.def;
    // @ts-expect-error - `def` should be possibly undefined here
    const ghi2: string = loaded.ghi;

    const abc3: string = loaded.abc ?? "fallback";
    const def3: string = loaded.def ?? "fallback";
    const ghi3: string = loaded.ghi ?? "fallback";
  }
}

//
// context: BpxPersistedStateValueConstraints
// test:    things cannot be optional on save, unless it is stated explicitly by
//          the type
//

{
  type MyPersistedState = {
    abc: string;
    def: string;
    ghi?: string;
  };

  // based on an explicitly provided template param's type
  BeetPx.savePersistedState<MyPersistedState>({
    abc: "xyz",
    // @ts-expect-error
    def: undefined,
    ghi: undefined,
  });

  // based on an inference of a template param's type
  BeetPx.savePersistedState({
    abc: "xyz",
    def: undefined,
    ghi: undefined,
  });
}
