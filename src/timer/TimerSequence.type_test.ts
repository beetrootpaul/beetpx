import { BpxTimerSequence, timerSeq_ } from "./TimerSequence";

//
// context: phases are inferred from a construction
// test:    a regular construction
//

{
  const ts = BpxTimerSequence.of(
    {
      intro: [
        ["aaa", 111],
        ["bbb", 222],
      ],
      loop: [
        ["ccc", 333],
        ["ddd", 444],
      ],
    },
    { pause: false, delayFrames: 0 },
  );

  switch (ts.currentPhase) {
    case "aaa":
      break;
    case "bbb":
      break;
    case "ccc":
      break;
    case "ddd":
      break;
    // @ts-expect-error
    case "eee":
      break;
    default:
  }
}

//
// context: phases are inferred from a construction
// test:    a factory helper
//

{
  const ts = timerSeq_({
    intro: [
      ["aaa", 111],
      ["bbb", 222],
    ],
    loop: [
      ["ccc", 333],
      ["ddd", 444],
    ],
  });

  switch (ts.currentPhase) {
    case "aaa":
      break;
    case "bbb":
      break;
    case "ccc":
      break;
    case "ddd":
      break;
    // @ts-expect-error
    case "eee":
      break;
    default:
  }
}

//
// context: phases are inferred from a construction
// test:    only intro
//

{
  const ts = timerSeq_({
    intro: [
      ["aaa", 111],
      ["bbb", 222],
    ],
  });

  switch (ts.currentPhase) {
    case "aaa":
      break;
    case "bbb":
      break;
    // @ts-expect-error
    case "ccc":
      break;
    // @ts-expect-error
    case "ddd":
      break;
    // @ts-expect-error
    case "eee":
      break;
    default:
  }
}

//
// context: phases are inferred from a construction
// test:    only loop
//

{
  const ts = timerSeq_({
    loop: [
      ["aaa", 111],
      ["bbb", 222],
    ],
  });

  switch (ts.currentPhase) {
    case "aaa":
      break;
    case "bbb":
      break;
    // @ts-expect-error
    case "ccc":
      break;
    // @ts-expect-error
    case "ddd":
      break;
    // @ts-expect-error
    case "eee":
      break;
    default:
  }
}
