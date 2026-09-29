export type Role = "mama" | "papa";

export type Pose =
  | "stand"
  | "wave"
  | "point"
  | "cheer"
  | "hug"
  | "play"
  | "jump"
  | "peek"
  | "kneel";

export type SceneId =
  | "garden"
  | "garden-can"
  | "garden-path"
  | "garden-box"
  | "garden-crowns"
  | "garden-hug"
  | "rain-room"
  | "fort"
  | "fort-inside"
  | "kitchen"
  | "bedroom"
  | "bedroom-sleep"
  | "band"
  | "concert"
  | "encore"
  | "bow"
  | "lights-down"
  | "doorway"
  | "puddle"
  | "puddle-look"
  | "puddle-leaf"
  | "walk-home"
  | "towels";

export type Speaker = "child" | "parent";

export type Bubble = {
  id: string;
  speaker: Speaker;
  text: string;
};

export type Actor = {
  who: Speaker;
  pose: Pose;
  flip?: boolean;
  x: string;
};

export type ComicPanel = {
  id: string;
  scene: SceneId;
  caption?: string;
  sfx?: string;
  bubbles: Bubble[];
  actors: Actor[];
};

export type StoryPage = {
  id: string;
  panels: ComicPanel[];
};

export type Story = {
  id: string;
  title: string;
  blurb: string;
  cover: SceneId;
  pages: StoryPage[];
};

export type Cast = {
  role: Role;
  parentName: string;
  childName: string;
  parentHair: string;
  childHair: string;
  parentSkin: string;
  childSkin: string;
  favorite: string;
};

export type Step = "taller" | "aventura" | "lectura";

export type ComicState = {
  cast: Cast;
  storyId: string;
  step: Step;
  pageIndex: number;
  edits: Record<string, string>;
};

export const HAIR = [
  { id: "castano", label: "Castaño", color: "#6b3a22" },
  { id: "negro", label: "Negro", color: "#241c16" },
  { id: "rubio", label: "Rubio", color: "#e2b657" },
  { id: "rojo", label: "Pelirrojo", color: "#c4491d" },
  { id: "canoso", label: "Canoso", color: "#d5d0c6" },
] as const;

export const SKIN = [
  { id: "porcelana", label: "Porcelana", color: "#f6d3b8" },
  { id: "melocoton", label: "Melocotón", color: "#efc09a" },
  { id: "canela", label: "Canela", color: "#d3966b" },
  { id: "miel", label: "Miel", color: "#b87343" },
  { id: "cacao", label: "Cacao", color: "#7a4a2b" },
] as const;

export const FAVORITES = [
  { id: "estrellas", phrase: "las estrellas" },
  { id: "galletas", phrase: "las galletas" },
  { id: "dinosaurios", phrase: "los dinosaurios" },
  { id: "mar", phrase: "el mar" },
  { id: "gatos", phrase: "los gatos" },
  { id: "cuentos", phrase: "los cuentos" },
] as const;

const STORAGE_KEY = "comic-de-los-dos-v1";
const STORAGE_EVENT = "comic-de-los-dos-change";

export function defaultCast(): Cast {
  return {
    role: "mama",
    parentName: "",
    childName: "",
    parentHair: HAIR[1].color,
    childHair: HAIR[0].color,
    parentSkin: SKIN[1].color,
    childSkin: SKIN[1].color,
    favorite: FAVORITES[0].phrase,
  };
}

export function defaultState(): ComicState {
  return {
    cast: defaultCast(),
    storyId: "limonero",
    step: "taller",
    pageIndex: -1,
    edits: {},
  };
}

const SERVER_SNAPSHOT = defaultState();
let cachedRaw: string | undefined;
let cachedState: ComicState = SERVER_SNAPSHOT;

export function displayChild(name: string) {
  const trimmed = name.trim();
  return trimmed.length > 0 ? trimmed : "tu hija";
}

export function displayParent(name: string, role: Role) {
  const trimmed = name.trim();
  if (trimmed.length > 0) return trimmed;
  return role === "mama" ? "mamá" : "papá";
}

export function roleWord(role: Role, capital = false) {
  const word = role === "mama" ? "mamá" : "papá";
  return capital ? word.charAt(0).toUpperCase() + word.slice(1) : word;
}

export function fill(text: string, cast: Cast) {
  const map: Record<string, string> = {
    "{{child}}": displayChild(cast.childName),
    "{{parent}}": displayParent(cast.parentName, cast.role),
    "{{role}}": roleWord(cast.role),
    "{{Role}}": roleWord(cast.role, true),
    "{{favorite}}": cast.favorite,
  };
  return text.replace(
    /\{\{(child|parent|role|Role|favorite)\}\}/g,
    (token) => map[token] ?? token,
  );
}

function parseComic(raw: string): ComicState {
  try {
    const parsed = JSON.parse(raw) as ComicState;
    if (!parsed?.cast || !parsed.storyId) return defaultState();
    return {
      ...defaultState(),
      ...parsed,
      cast: { ...defaultCast(), ...parsed.cast },
      edits: parsed.edits ?? {},
    };
  } catch {
    return defaultState();
  }
}

export function readComic(): ComicState {
  const raw = window.localStorage.getItem(STORAGE_KEY) ?? "";
  if (raw === cachedRaw) return cachedState;
  cachedRaw = raw;
  cachedState = raw ? parseComic(raw) : defaultState();
  return cachedState;
}

export function serverComic(): ComicState {
  return SERVER_SNAPSHOT;
}

export function subscribeComic(onChange: () => void) {
  window.addEventListener(STORAGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(STORAGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function writeComic(state: ComicState) {
  const raw = JSON.stringify(state);
  window.localStorage.setItem(STORAGE_KEY, raw);
  cachedRaw = raw;
  cachedState = state;
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

export function clearComic() {
  window.localStorage.removeItem(STORAGE_KEY);
  cachedRaw = "";
  cachedState = defaultState();
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

export function emptySubscribe() {
  return () => undefined;
}

export function clientReady() {
  return true;
}

export function serverPending() {
  return false;
}
