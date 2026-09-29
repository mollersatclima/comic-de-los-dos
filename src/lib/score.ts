type Bed = "play" | "talk" | "quiet";

const LEVEL: Record<Bed, number> = { play: 0.72, talk: 0.16, quiet: 0 };
const BEAT = 60 / 84;

const CHORDS: number[][] = [
  [261.63, 329.63, 392],
  [261.63, 329.63, 392],
  [196, 246.94, 392],
  [220, 261.63, 329.63],
  [174.61, 261.63, 349.23],
  [174.61, 261.63, 349.23],
  [196, 246.94, 392],
  [261.63, 329.63, 392],
];

const MELODY = [659.25, 783.99, 880, 783.99, 659.25, 587.33, 523.25, 587.33];

let context: AudioContext | null = null;
let master: GainNode | null = null;
let filter: BiquadFilterNode | null = null;
let timer = 0;
let playing = false;
let bed: Bed = "quiet";
const listeners = new Set<() => void>();

export function scoreIsOn() {
  return playing;
}

export function subscribeScore(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function emit() {
  for (const listener of listeners) listener();
  if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
    (window as Window & { __comicScore?: string }).__comicScore = playing ? (context?.state ?? "on") : "off";
  }
}

function ensure() {
  if (context && master && filter) return context;
  const Ctx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) throw new Error("audio");
  context = new Ctx();
  filter = context.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 2100;
  master = context.createGain();
  master.gain.value = 0;
  filter.connect(master);
  master.connect(context.destination);
  return context;
}

function ramp() {
  if (!context || !master) return;
  const now = context.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.linearRampToValueAtTime(LEVEL[bed], now + 0.18);
}

function pluck(freq: number, time: number, gain: number, type: OscillatorType, decay: number) {
  if (!context || !filter) return;
  const osc = context.createOscillator();
  const amp = context.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, time);
  amp.gain.setValueAtTime(0.0001, time);
  amp.gain.exponentialRampToValueAtTime(Math.max(gain, 0.0002), time + 0.02);
  amp.gain.exponentialRampToValueAtTime(0.0001, time + decay);
  osc.connect(amp);
  amp.connect(filter);
  osc.start(time);
  osc.stop(time + decay + 0.05);
}

function schedule(from: number) {
  for (let i = 0; i < 8; i++) {
    const time = from + i * BEAT;
    const chord = CHORDS[i];
    if (!chord) continue;
    if (i % 2 === 0) {
      for (const note of chord) pluck(note, time, 0.05, "triangle", 0.42);
      pluck(chord[0] / 2, time, 0.07, "sine", 0.7);
    }
    const melody = MELODY[i];
    if (melody) pluck(melody, time + 0.06, 0.055, "sine", 0.26);
  }
}

function loop() {
  if (!playing || !context) return;
  schedule(context.currentTime + 0.06);
  timer = window.setTimeout(loop, BEAT * 8 * 1000 - 70);
}

async function begin() {
  let ctx: AudioContext;
  try {
    ctx = ensure();
    await ctx.resume();
  } catch {
    playing = false;
    emit();
    return;
  }
  if (!playing) return;
  bed = "play";
  ramp();
  loop();
  emit();
}

export function setScore(next: boolean) {
  if (next === playing) {
    if (next && context?.state === "suspended") void context.resume();
    return;
  }
  playing = next;
  if (!next) {
    window.clearTimeout(timer);
    bed = "quiet";
    ramp();
    emit();
    return;
  }
  emit();
  void begin();
}

export function setBed(next: Bed) {
  if (!playing) return;
  bed = next;
  ramp();
}

export function scoreServerOff() {
  return false;
}
