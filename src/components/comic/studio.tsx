"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Character } from "@/components/comic/character";
import { PanelView } from "@/components/comic/panel";
import { Scene } from "@/components/comic/scenes";
import { VideoPlayer } from "@/components/comic/video-player";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FAVORITES,
  HAIR,
  SKIN,
  clearComic,
  clientReady,
  displayChild,
  displayParent,
  emptySubscribe,
  favoritePhrase,
  readComic,
  roleWord,
  serverComic,
  serverPending,
  subscribeComic,
  writeComic,
  type Cast,
  type ComicState,
  type Lang,
  type SceneId,
} from "@/lib/comic";
import { asset } from "@/lib/asset";
import { optionLabel, say, t } from "@/lib/i18n";
import { scoreIsOn, scoreServerOff, setBed, setScore, subscribeScore } from "@/lib/score";
import { STORIES, getStory } from "@/lib/stories";
import { cn } from "@/lib/utils";

export function Studio() {
  const ready = useSyncExternalStore(emptySubscribe, clientReady, serverPending);
  const state = useSyncExternalStore(subscribeComic, readComic, serverComic);
  const [editingAll, setEditingAll] = useState(false);
  const [activeBubble, setActiveBubble] = useState<string | null>(null);

  const lang = state.lang === "es" ? "es" : "pt";

  useEffect(() => {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "es";
    document.title = t(lang, "title");
  }, [lang]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (document.getElementById("comic-video")) return;
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      setActiveBubble(null);
      const current = readComic();
      if (current.step !== "lectura") return;
      const currentStory = getStory(current.storyId);
      if (event.key === "ArrowRight") {
        if (current.pageIndex >= currentStory.pages.length - 1) return;
        writeComic({ ...current, pageIndex: current.pageIndex + 1 });
        return;
      }
      if (current.pageIndex <= -1) return;
      writeComic({ ...current, pageIndex: current.pageIndex - 1 });
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const story = getStory(state.storyId);
  const lastPage = story.pages.length - 1;
  const namesReady =
    state.cast.childName.trim().length > 0 && state.cast.parentName.trim().length > 0;

  function patch(partial: Partial<ComicState>) {
    writeComic({ ...readComic(), ...partial });
  }

  function patchCast(partial: Partial<Cast>) {
    const current = readComic();
    writeComic({ ...current, cast: { ...current.cast, ...partial } });
  }

  function goNext() {
    setActiveBubble(null);
    const current = readComic();
    const currentStory = getStory(current.storyId);
    if (current.pageIndex >= currentStory.pages.length - 1) return;
    writeComic({ ...current, pageIndex: current.pageIndex + 1 });
  }

  function goBack() {
    setActiveBubble(null);
    const current = readComic();
    if (current.pageIndex <= -1) return;
    writeComic({ ...current, pageIndex: current.pageIndex - 1 });
  }

  function resetAll() {
    clearComic();
    setEditingAll(false);
    setActiveBubble(null);
  }

  if (!ready) {
    return (
      <div className="grid min-h-dvh place-items-center px-6">
        <p className="font-display text-2xl text-ink">Abrindo o caderno…</p>
      </div>
    );
  }

  return (
    <div className="min-h-dvh text-ink">
      <header className="no-print mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <button
          type="button"
          onClick={() => patch({ step: "taller" })}
          className="text-left"
        >
          <span className="block font-display text-2xl leading-none tracking-wide whitespace-nowrap">
            {t(lang, "title")}
          </span>
          <span className="font-comic text-sm text-muted-foreground">{t(lang, "tagline")}</span>
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            className="h-10 bg-[#e63946] hover:bg-[#d62839] text-white font-display shadow-[2px_2px_0_#1b2a4a] text-sm"
            onClick={() => patch({ step: "aventura" })}
          >
            📖 {lang === "pt" ? "Ver Histórias" : "Ver Aventuras"}
          </Button>
          <div className="flex overflow-hidden border-[3px] border-ink" role="group" aria-label={t(lang, "language")}>
            {(
              [
                ["pt", "PT"],
                ["es", "ES"],
              ] as const
            ).map(([code, label]) => (
              <button
                key={code}
                type="button"
                aria-pressed={lang === code}
                aria-label={code === "pt" ? t(lang, "portuguese") : t(lang, "spanish")}
                onClick={() => patch({ lang: code })}
                className={cn(
                  "h-10 px-3 font-display text-sm",
                  lang === code ? "bg-comic-navy text-white" : "bg-white",
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <HowToRead lang={lang} />
          <ResetDialog lang={lang} onReset={resetAll} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 pb-16">
        {state.step === "taller" && (
          <Setup
            cast={state.cast}
            lang={lang}
            namesReady={namesReady}
            onCast={patchCast}
            onContinue={() =>
              patch({
                step: "aventura",
                cast: {
                  ...state.cast,
                  childName: state.cast.childName.trim(),
                  parentName: state.cast.parentName.trim(),
                },
              })
            }
          />
        )}
        {state.step === "aventura" && (
          <Picker
            cast={state.cast}
            lang={lang}
            onBack={() => patch({ step: "taller" })}
            onPick={(storyId) =>
              patch({ storyId, step: "lectura", pageIndex: -1 })
            }
          />
        )}
        {state.step === "lectura" && (
          <Reader
            state={state}
            editingAll={editingAll}
            activeBubble={activeBubble}
            onToggleEdit={() => {
              setEditingAll((value) => !value);
              setActiveBubble(null);
            }}
            onActivate={(id) => {
              setEditingAll(false);
              setActiveBubble(id);
            }}
            onChange={(id, value) => {
              const current = readComic();
              writeComic({
                ...current,
                edits: { ...current.edits, [id]: value },
              });
            }}
            onBack={goBack}
            onNext={goNext}
            onJump={(pageIndex) => {
              setActiveBubble(null);
              patch({ pageIndex });
            }}
            onStories={() => patch({ step: "aventura" })}
            onRestart={() => patch({ pageIndex: -1 })}
            atStart={state.pageIndex <= -1}
            atEnd={state.pageIndex >= lastPage}
          />
        )}
      </main>
    </div>
  );
}

function Setup({
  cast,
  lang,
  namesReady,
  onCast,
  onContinue,
}: {
  cast: Cast;
  lang: Lang;
  namesReady: boolean;
  onCast: (partial: Partial<Cast>) => void;
  onContinue: () => void;
}) {
  return (
    <div className="space-y-8">
      {/* Anime Avatars Showcase */}
      <section className="border-[3px] border-ink bg-[#fffdf5] p-5 shadow-[6px_6px_0_#1b2a4a]">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-ink/20 pb-3">
          <div>
            <span className="inline-block bg-[#f59e0b] px-2.5 py-0.5 font-display text-xs font-bold uppercase tracking-wider text-ink shadow-[2px_2px_0_#1b2a4a]">
              Anime DBZ Character Cards
            </span>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl">
              {lang === "pt" ? "Personagens Oficiais do Mangá" : "Personajes Oficiales del Manga"}
            </h2>
          </div>
          <p className="font-comic text-xs text-muted-foreground">
            {lang === "pt" ? "Design original de Akira Toriyama (DBZ 90s)" : "Diseño fiel estilo Toriyama DBZ 90s"}
          </p>
        </div>

        <div className="mt-5 grid gap-6 md:grid-cols-3">
          {/* Nicolas card */}
          <div className="overflow-hidden border-[3px] border-ink bg-white shadow-[4px_4px_0_#1b2a4a]">
            <div className="relative aspect-square w-full bg-[#f6ead4]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset("/art/avatar-nicolas.png")}
                alt="Avatar Nicolas anime"
                className="h-full w-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-[#e63946] px-2.5 py-1 font-display text-xs text-white shadow-[2px_2px_0_#1b2a4a]">
                #01 · NICOLAS (ESPAÑA)
              </span>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl">Nicolas Moller</h3>
                <span className="rounded bg-[#2a9d8f]/20 px-2 py-0.5 font-comic text-xs font-bold text-[#2a9d8f]">
                  Madrid · Viajero
                </span>
              </div>
              <p className="font-comic text-sm text-ink/80 leading-snug">
                {lang === "pt"
                  ? "Cabelo escuro, óculos metálicos com ponte dupla, camisa clara e pulseira prateada. Capaz de cruzar dimensões para ver sua filha."
                  : "Pelo castaño oscuro, gafas de doble puente, camiseta crema y pulsera de eslabones plateada. Capaz de atravesar dimensiones para ver a su hija."}
              </p>
            </div>
          </div>

          {/* Aynara card (9 years old) */}
          <div className="overflow-hidden border-[3px] border-ink bg-white shadow-[4px_4px_0_#1b2a4a]">
            <div className="relative aspect-square w-full bg-[#f6ead4]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset("/art/avatar-aynara-stars.jpg")}
                alt="Avatar Aynara 9 años anime"
                className="h-full w-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-[#f59e0b] px-2.5 py-1 font-display text-xs text-ink shadow-[2px_2px_0_#1b2a4a]">
                #02 · AYNARA (9 ANOS)
              </span>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl">Aynara Moller</h3>
                <span className="rounded bg-[#e76f51]/20 px-2 py-0.5 font-comic text-xs font-bold text-[#e76f51]">
                  Rio · 9 anos
                </span>
              </div>
              <p className="font-comic text-sm text-ink/80 leading-snug">
                {lang === "pt"
                  ? "9 anos. De pé, a cabeça dela chega só até o cotovelo do Nicolas. Rosto redondo, pernas curtas, camiseta coral."
                  : "9 años. De pie, su cabeza llega solo hasta el codo de Nicolas. Cara redonda, piernas cortas, camiseta coral."}
              </p>
            </div>
          </div>

          <div className="overflow-hidden border-[3px] border-ink bg-white shadow-[4px_4px_0_#1b2a4a]">
            <div className="relative aspect-square w-full bg-[#f6ead4]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset("/art/avatar-nilo.jpg")}
                alt="Avatar de Nilo, compañero original"
                className="h-full w-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-[#8d5a3a] px-2.5 py-1 font-display text-xs text-white shadow-[2px_2px_0_#1b2a4a]">
                #03 · NILO
              </span>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl">Nilo</h3>
                <span className="rounded bg-[#e8b086]/40 px-2 py-0.5 font-comic text-xs font-bold text-[#6b3a22]">
                  Del limonero
                </span>
              </div>
              <p className="font-comic text-sm text-ink/80 leading-snug">
                {lang === "pt"
                  ? "Companheiro original do tamanho de um gato. Pelagem de damasco, capuz castanho, estrela no peito e cauda anelada. A cabeça chega ao joelho da Aynara."
                  : "Compañero original del tamaño de un gato. Pelo albaricoque, capucha castaña, estrella en el pecho y cola anillada. La cabeza le llega a la rodilla de Aynara."}
              </p>
            </div>
          </div>
        </div>
        <figure className="mt-6 overflow-hidden border-[3px] border-ink bg-white shadow-[4px_4px_0_#1b2a4a]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset("/art/height-nilo.jpg")}
            alt="Escala: la cabeza de Aynara llega al codo de Nicolas y Nilo es del tamaño de un gato"
            className="h-auto w-full"
          />
          <figcaption className="px-4 py-3 font-comic text-sm text-ink/80">
            {lang === "pt"
              ? "Escala fixa: a cabeça da Aynara no cotovelo do Nicolas, e o Nilo do tamanho de um gato."
              : "Escala fija: la cabeza de Aynara en el codo de Nicolas, y Nilo del tamaño de un gato."}
          </figcaption>
        </figure>
      </section>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <CoverCard
          cast={cast}
          lang={lang}
          title={t(lang, "today")}
          kicker={t(lang, "coverKicker")}
          art="/art/scene-cover.jpg"
        />
        <form
          className="space-y-6 border-[3px] border-ink bg-sheet p-4 shadow-[6px_6px_0_#1b2a4a] sm:p-6"
          onSubmit={(event) => {
            event.preventDefault();
            if (namesReady) onContinue();
          }}
        >
          <div>
            <h1 className="font-display text-4xl leading-none">{t(lang, "draw")}</h1>
            <p className="mt-2 font-comic text-lg leading-snug">{t(lang, "drawBody")}</p>
          </div>

        <fieldset className="space-y-2">
          <legend className="font-display text-sm tracking-wide">{t(lang, "who")}</legend>
          <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label={t(lang, "whoLabel")}>
            {(
              [
                ["mama", t(lang, "imMom")],
                ["papa", t(lang, "imDad")],
              ] as const
            ).map(([role, label]) => (
              <button
                key={role}
                type="button"
                role="radio"
                aria-checked={cast.role === role}
                onClick={() => onCast({ role })}
                className={cn(
                  "h-12 border-[3px] border-ink font-comic text-lg font-bold shadow-[3px_3px_0_#1b2a4a]",
                  cast.role === role ? "bg-ink text-sheet" : "bg-white",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="parent-name" className="font-display">
              {t(lang, "yourName")}
            </Label>
            <Input
              id="parent-name"
              value={cast.parentName}
              maxLength={18}
              placeholder="Nicolas"
              onChange={(event) => onCast({ parentName: event.target.value })}
              className="h-11 border-[3px] border-ink bg-white font-comic text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="child-name" className="font-display">
              {t(lang, "herName")}
            </Label>
            <Input
              id="child-name"
              value={cast.childName}
              maxLength={18}
              placeholder="Aynara"
              onChange={(event) => onCast({ childName: event.target.value })}
              className="h-11 border-[3px] border-ink bg-white font-comic text-base"
            />
          </div>
        </div>

        <Swatches
          label={t(lang, "herHair")}
          lang={lang}
          options={HAIR}
          value={cast.childHair}
          onChange={(color) => onCast({ childHair: color })}
        />
        <Swatches
          label={`${t(lang, "hairOf")} ${roleWord(cast.role, false, lang)}`}
          lang={lang}
          options={HAIR}
          value={cast.parentHair}
          onChange={(color) => onCast({ parentHair: color })}
        />
        <Swatches
          label={t(lang, "herSkin")}
          lang={lang}
          options={SKIN}
          value={cast.childSkin}
          onChange={(color) => onCast({ childSkin: color })}
        />
        <Swatches
          label={`${t(lang, "skinOf")} ${roleWord(cast.role, false, lang)}`}
          lang={lang}
          options={SKIN}
          value={cast.parentSkin}
          onChange={(color) => onCast({ parentSkin: color })}
        />

        <fieldset className="space-y-2">
          <legend className="font-display text-sm tracking-wide">{t(lang, "loves")}</legend>
          <div className="flex flex-wrap gap-2">
            {FAVORITES.map((favorite) => {
              const selected = cast.favorite === favorite.phrase;
              return (
                <button
                  key={favorite.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onCast({ favorite: favorite.phrase })}
                  className={cn(
                    "border-[3px] border-ink px-3 py-1.5 font-comic text-base font-bold",
                    selected ? "bg-comic-yellow shadow-[3px_3px_0_#1b2a4a]" : "bg-white",
                  )}
                >
                  {favoritePhrase(favorite.phrase, lang)}
                </button>
              );
            })}
          </div>
        </fieldset>

        <Button
          type="submit"
          disabled={!namesReady}
          className="h-12 w-full font-display text-lg tracking-wide disabled:opacity-40"
        >
          {t(lang, "pickAdventure")}
        </Button>
        {!namesReady && (
          <p className="text-center font-comic text-sm text-muted-foreground">{t(lang, "needNames")}</p>
        )}
      </form>
    </div>
    </div>
  );
}

function Swatches({
  label,
  lang,
  options,
  value,
  onChange,
}: {
  label: string;
  lang: Lang;
  options: readonly { id: string; label: string; color: string }[];
  value: string;
  onChange: (color: string) => void;
}) {
  const selected = options.find((option) => option.color === value);
  return (
    <fieldset className="space-y-2">
      <legend className="font-display text-sm tracking-wide">
        {label}
        <span className="ml-2 font-comic font-bold tracking-normal">
          {selected ? optionLabel(lang, selected.id, selected.label) : ""}
        </span>
      </legend>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
        {options.map((option) => {
          const isSelected = option.color === value;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={optionLabel(lang, option.id, option.label)}
              onClick={() => onChange(option.color)}
              className={cn(
                "size-10 rounded-full border-[3px] border-ink",
                isSelected && "ring-2 ring-ink ring-offset-2 ring-offset-sheet",
              )}
              style={{ backgroundColor: option.color }}
            />
          );
        })}
      </div>
    </fieldset>
  );
}

function Picker({
  cast,
  lang,
  onBack,
  onPick,
}: {
  cast: Cast;
  lang: Lang;
  onBack: () => void;
  onPick: (storyId: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl leading-none">{t(lang, "choose")}</h1>
          <p className="mt-2 max-w-xl font-comic text-lg leading-snug">
            {displayChild(cast.childName, lang)} {t(lang, "and")}{" "}
            {displayParent(cast.parentName, cast.role, lang)} {t(lang, "theyAppear")}
          </p>
        </div>
        <Button type="button" variant="outline" className="h-10 border-[3px] border-ink bg-white font-comic" onClick={onBack}>
          {t(lang, "changeNames")}
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {STORIES.map((story, index) => (
          <article
            key={story.id}
            className="flex flex-col border-[3px] border-ink bg-sheet shadow-[5px_5px_0_#1b2a4a] motion-safe:transition-transform motion-safe:hover:-translate-y-0.5"
          >
            <div className="relative h-40 overflow-hidden border-b-[3px] border-ink">
              {story.coverArt ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset(story.coverArt)}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover object-center"
                  />
                  <div className="halftone pointer-events-none absolute inset-0 opacity-20" />
                </>
              ) : (
                <>
                  <Scene id={story.cover} />
                  <div className="halftone pointer-events-none absolute inset-0" />
                  <CastOnScene cast={cast} apart={story.id === "espejo"} />
                </>
              )}
              <span className="absolute top-2 left-2 border-[3px] border-ink bg-comic-yellow px-2 font-display text-sm">
                N.º {index + 1}
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-3 p-4">
              <h2 className="font-display text-2xl leading-none">{say(lang, story.title, cast)}</h2>
              <p className="font-comic text-base leading-snug">{say(lang, story.blurb, cast)}</p>
              <Button
                type="button"
                className="mt-auto h-11 font-display tracking-wide"
                onClick={() => onPick(story.id)}
              >
                {t(lang, "readThis")}
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Reader({
  state,
  editingAll,
  activeBubble,
  onToggleEdit,
  onActivate,
  onChange,
  onBack,
  onNext,
  onJump,
  onStories,
  onRestart,
  atStart,
  atEnd,
}: {
  state: ComicState;
  editingAll: boolean;
  activeBubble: string | null;
  onToggleEdit: () => void;
  onActivate: (id: string) => void;
  onChange: (id: string, value: string) => void;
  onBack: () => void;
  onNext: () => void;
  onJump: (pageIndex: number) => void;
  onStories: () => void;
  onRestart: () => void;
  atStart: boolean;
  atEnd: boolean;
}) {
  const story = getStory(state.storyId);
  const lang = state.lang === "es" ? "es" : "pt";
  const page = state.pageIndex >= 0 ? story.pages[state.pageIndex] : null;
  const [video, setVideo] = useState(false);
  const music = useSyncExternalStore(subscribeScore, scoreIsOn, scoreServerOff);
  const musicWasOn = useRef(false);

  return (
    <div className="space-y-4">
      <div className="no-print flex flex-wrap items-center justify-between gap-2">
        <p className="font-comic text-base">
          {atStart
            ? t(lang, "cover")
            : `${t(lang, "page")} ${state.pageIndex + 1} ${t(lang, "of")} ${story.pages.length}`}
          <span className="text-muted-foreground"> · {say(lang, story.title, state.cast)}</span>
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-10 border-[3px] border-ink bg-[#f59e0b] hover:bg-[#d97706] text-ink font-display shadow-[2px_2px_0_#1b2a4a]"
            onClick={onStories}
          >
            ⭐ {t(lang, "otherStories")}
          </Button>
          <Button
            type="button"
            variant={editingAll ? "default" : "outline"}
            className="h-10 border-[3px] border-ink font-comic"
            aria-pressed={editingAll}
            onClick={onToggleEdit}
          >
            {editingAll ? t(lang, "doneReading") : t(lang, "writeLines")}
          </Button>
          <Button
            type="button"
            className="h-10 bg-[#e63946] hover:bg-[#d62839] text-white font-display shadow-[2px_2px_0_#1b2a4a]"
            onClick={() => {
              musicWasOn.current = scoreIsOn();
              setScore(true);
              setVideo(true);
            }}
          >
            🎬 {t(lang, "watchVideo")}
          </Button>
          <Button
            type="button"
            variant={music ? "default" : "outline"}
            className="h-10 border-[3px] border-ink font-comic"
            aria-pressed={music}
            onClick={() => setScore(!music)}
          >
            {music ? t(lang, "musicOn") : t(lang, "musicOff")}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-10 border-[3px] border-ink bg-white font-comic"
            onClick={() => window.print()}
          >
            {t(lang, "print")}
          </Button>
        </div>
      </div>

      <div className="comic-sheet no-print flex overflow-hidden border-[4px] border-ink bg-sheet shadow-[8px_8px_0_#1b2a4a]">
        <div className="hidden w-7 shrink-0 bg-[#9b2331] sm:block" />
        <div className="min-w-0 flex-1 p-3 sm:p-5">
          {atStart || !page ? (
            <CoverCard
              cast={state.cast}
              lang={lang}
              title={say(lang, story.title, state.cast)}
              kicker={say(lang, story.title, state.cast)}
              issue={STORIES.findIndex((item) => item.id === story.id) + 1}
              scene={story.cover}
              art={story.coverArt}
              apart={story.id === "espejo"}
            />
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {page.panels.map((panel) => (
                <PanelView
                  key={panel.id}
                  panel={panel}
                  cast={state.cast}
                  lang={lang}
                  edits={state.edits}
                  editingAll={editingAll}
                  activeBubble={activeBubble}
                  onActivate={onActivate}
                  onChange={onChange}
                />
              ))}
            </div>
          )}
          {atEnd && (
            <p className="mt-3 pr-1 text-right font-display text-4xl tracking-wide text-comic-red">
              {t(lang, "theEnd")}
            </p>
          )}
        </div>
      </div>

      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          className="h-12 border-[3px] border-ink bg-white px-5 font-display text-base"
          onClick={onBack}
          disabled={atStart}
        >
          {t(lang, "previous")}
        </Button>
        <nav className="flex items-center gap-1" aria-label={t(lang, "pages")}>
          <button
            type="button"
            aria-label={t(lang, "cover")}
            aria-current={atStart ? "page" : undefined}
            onClick={() => onJump(-1)}
            className="grid size-9 place-items-center"
          >
            <span
              className={cn(
                "size-3 border-2 border-ink",
                atStart ? "bg-comic-red" : "bg-white",
              )}
            />
          </button>
          {story.pages.map((storyPage, index) => (
            <button
              key={storyPage.id}
              type="button"
              aria-label={`${t(lang, "page")} ${index + 1}`}
              aria-current={index === state.pageIndex ? "page" : undefined}
              onClick={() => onJump(index)}
              className="grid size-9 place-items-center"
            >
              <span
                className={cn(
                  "size-3 border-2 border-ink",
                  index === state.pageIndex ? "bg-comic-red" : "bg-white",
                )}
              />
            </button>
          ))}
        </nav>
        {atEnd ? (
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-12 border-[3px] border-ink bg-white px-4 font-display"
              onClick={onRestart}
            >
              {t(lang, "readAgain")}
            </Button>
            <Button type="button" className="h-12 px-4 font-display" onClick={onStories}>
              {t(lang, "another")}
            </Button>
          </div>
        ) : (
          <Button type="button" className="h-12 px-5 font-display text-base" onClick={onNext}>
            {atStart ? t(lang, "openComic") : t(lang, "next")}
          </Button>
        )}
      </div>
      <p className="no-print text-center font-comic text-sm text-muted-foreground">
        {t(lang, "voiceHint")} {roleWord(state.cast.role, false, lang)}. {t(lang, "voiceHintEnd")}
      </p>
      {video && (
        <VideoPlayer
          cast={state.cast}
          story={story}
          lang={lang}
          edits={state.edits}
          onClose={() => {
            if (musicWasOn.current) setBed("play");
            else setScore(false);
            setVideo(false);
          }}
        />
      )}

      <div className="hidden print:block">
        <p className="font-display text-3xl">{say(lang, story.title, state.cast)}</p>
        <p className="mb-4 font-comic text-lg">
          {displayChild(state.cast.childName, lang)} {t(lang, "and")}{" "}
          {displayParent(state.cast.parentName, state.cast.role, lang)}
        </p>
        <div className="grid gap-4">
          {story.pages.map((storyPage) => (
            <div key={storyPage.id} className="grid gap-3 md:grid-cols-2">
              {storyPage.panels.map((panel) => (
                <PanelView
                  key={`print-${panel.id}`}
                  panel={panel}
                  cast={state.cast}
                  lang={lang}
                  edits={state.edits}
                  editingAll={false}
                  activeBubble={null}
                  onActivate={() => undefined}
                  onChange={() => undefined}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CoverCard({
  cast,
  lang,
  title,
  kicker,
  issue,
  scene = "garden",
  art,
  apart = false,
}: {
  cast: Cast;
  lang: Lang;
  title: string;
  kicker: string;
  issue?: number;
  scene?: SceneId;
  art?: string;
  apart?: boolean;
}) {
  return (
    <div className="relative flex min-h-[520px] flex-col overflow-hidden border-[3px] border-ink bg-[#8ecae6]">
      {art ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset(art)}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1b2a4a]/40 via-transparent to-[#1b2a4a]/60" />
        </>
      ) : (
        <>
          <Scene id={scene} />
          <div className="halftone pointer-events-none absolute inset-0" />
        </>
      )}
      <div className="relative z-20 flex flex-col items-center px-4 pt-5 text-center">
        <div className="w-full max-w-md border-[3px] border-ink bg-sheet/95 px-4 py-4 shadow-[4px_4px_0_#1b2a4a]">
          <p className="font-comic text-xs font-bold tracking-[0.18em] uppercase">
            {issue ? `N.º ${issue} · ${t(lang, "together")}` : kicker}
          </p>
          <h2 className="mt-1 font-display text-4xl leading-[0.95] text-balance sm:text-5xl">{title}</h2>
          <p className="mt-2 font-comic text-lg leading-snug font-bold text-balance">
            {displayChild(cast.childName, lang)} {t(lang, "and")} {displayParent(cast.parentName, cast.role, lang)}
          </p>
          <p className="font-comic text-base text-balance">
            {t(lang, "collects")} {favoritePhrase(cast.favorite, lang)}.
          </p>
        </div>
      </div>
      {!art && (
        <div className="relative z-10 mt-auto h-60 sm:h-72">
          <CastOnScene cast={cast} apart={apart} />
        </div>
      )}
    </div>
  );
}

function CastOnScene({ cast, apart = false }: { cast: Cast; apart?: boolean }) {
  const child = (
    <Character who="child" hair={cast.childHair} skin={cast.childSkin} pose="wave" flip={apart} />
  );
  const parent = (
    <Character who={cast.role} hair={cast.parentHair} skin={cast.parentSkin} pose="wave" flip={!apart} />
  );
  return (
    <>
      <div className="absolute bottom-0 left-[8%] z-10 h-[92%]" style={{ aspectRatio: "160 / 230" }}>
        {apart ? parent : child}
      </div>
      <div className="absolute right-[8%] bottom-0 z-10 h-full" style={{ aspectRatio: "160 / 230" }}>
        {apart ? child : parent}
      </div>
    </>
  );
}

function HowToRead({ lang }: { lang: Lang }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="h-10 border-[3px] border-ink bg-white font-comic">
          {t(lang, "howTo")}
        </Button>
      </DialogTrigger>
      <DialogContent className="border-[3px] border-ink bg-sheet sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">{t(lang, "howTitle")}</DialogTitle>
          <DialogDescription className="font-comic text-base text-ink">{t(lang, "howBody")}</DialogDescription>
        </DialogHeader>
        <ol className="list-decimal space-y-2 pl-5 font-comic text-base leading-snug">
          <li>{t(lang, "how1")}</li>
          <li>{t(lang, "how2")}</li>
          <li>{t(lang, "how3")}</li>
          <li>{t(lang, "how4")}</li>
        </ol>
        <DialogClose asChild>
          <Button type="button" className="h-11 font-display">
            {t(lang, "gotIt")}
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

function ResetDialog({ lang, onReset }: { lang: Lang; onReset: () => void }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="ghost" className="h-10 font-comic text-muted-foreground">
          {t(lang, "reset")}
        </Button>
      </DialogTrigger>
      <DialogContent className="border-[3px] border-ink bg-sheet sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">{t(lang, "resetTitle")}</DialogTitle>
          <DialogDescription className="font-comic text-base text-ink">{t(lang, "resetBody")}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="h-11 border-[3px] border-ink bg-white font-comic">
              {t(lang, "betterNot")}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" className="h-11 font-display" onClick={onReset}>
              {t(lang, "yesDelete")}
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
