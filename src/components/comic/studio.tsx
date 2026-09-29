"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Character } from "@/components/comic/character";
import { PanelView } from "@/components/comic/panel";
import { Scene } from "@/components/comic/scenes";
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
  readComic,
  roleWord,
  serverComic,
  serverPending,
  subscribeComic,
  writeComic,
  type Cast,
  type ComicState,
} from "@/lib/comic";
import { STORIES, getStory } from "@/lib/stories";
import { cn } from "@/lib/utils";

export function Studio() {
  const ready = useSyncExternalStore(emptySubscribe, clientReady, serverPending);
  const state = useSyncExternalStore(subscribeComic, readComic, serverComic);
  const [editingAll, setEditingAll] = useState(false);
  const [activeBubble, setActiveBubble] = useState<string | null>(null);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
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
        <p className="font-display text-2xl text-ink">Abriendo el cuaderno…</p>
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
            Cómic de los dos
          </span>
          <span className="font-comic text-sm text-muted-foreground">
            Una historia para leer en voz alta
          </span>
        </button>
        <div className="flex items-center gap-2">
          <HowToRead />
          <ResetDialog onReset={resetAll} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 pb-16">
        {state.step === "taller" && (
          <Setup
            cast={state.cast}
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
  namesReady,
  onCast,
  onContinue,
}: {
  cast: Cast;
  namesReady: boolean;
  onCast: (partial: Partial<Cast>) => void;
  onContinue: () => void;
}) {
  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <CoverCard cast={cast} title="Las aventuras de hoy" kicker="N.º 0 · Portada" />
      <form
        className="space-y-6 border-[3px] border-ink bg-sheet p-4 shadow-[6px_6px_0_#1c1917] sm:p-6"
        onSubmit={(event) => {
          event.preventDefault();
          if (namesReady) onContinue();
        }}
      >
        <div>
          <h1 className="font-display text-4xl leading-none">Vamos a dibujarlos</h1>
          <p className="mt-2 font-comic text-lg leading-snug">
            Cuéntame quiénes son. Después eligen una aventura y, si una frase no
            les suena, la cambian. El cómic queda de ustedes dos.
          </p>
        </div>

        <fieldset className="space-y-2">
          <legend className="font-display text-sm tracking-wide">Quién cuenta contigo</legend>
          <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Quién cuenta la historia">
            {(
              [
                ["mama", "Soy mamá"],
                ["papa", "Soy papá"],
              ] as const
            ).map(([role, label]) => (
              <button
                key={role}
                type="button"
                role="radio"
                aria-checked={cast.role === role}
                onClick={() => onCast({ role })}
                className={cn(
                  "h-12 border-[3px] border-ink font-comic text-lg font-bold shadow-[3px_3px_0_#1c1917]",
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
              Tu nombre
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
              El nombre de tu hija
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
          label="Pelo de ella"
          options={HAIR}
          value={cast.childHair}
          onChange={(color) => onCast({ childHair: color })}
        />
        <Swatches
          label={`Pelo de ${roleWord(cast.role)}`}
          options={HAIR}
          value={cast.parentHair}
          onChange={(color) => onCast({ parentHair: color })}
        />
        <Swatches
          label="Piel de ella"
          options={SKIN}
          value={cast.childSkin}
          onChange={(color) => onCast({ childSkin: color })}
        />
        <Swatches
          label={`Piel de ${roleWord(cast.role)}`}
          options={SKIN}
          value={cast.parentSkin}
          onChange={(color) => onCast({ parentSkin: color })}
        />

        <fieldset className="space-y-2">
          <legend className="font-display text-sm tracking-wide">Lo que a ella le encanta</legend>
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
                    selected ? "bg-comic-yellow shadow-[3px_3px_0_#1c1917]" : "bg-white",
                  )}
                >
                  {favorite.phrase}
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
          Elegir la aventura
        </Button>
        {!namesReady && (
          <p className="text-center font-comic text-sm text-muted-foreground">
            Faltan los dos nombres para abrir el cómic.
          </p>
        )}
      </form>
    </div>
  );
}

function Swatches({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly { id: string; label: string; color: string }[];
  value: string;
  onChange: (color: string) => void;
}) {
  const selected = options.find((option) => option.color === value);
  return (
    <fieldset className="space-y-2">
      <legend className="font-display text-sm tracking-wide">
        {label}
        <span className="ml-2 font-comic font-bold tracking-normal">{selected?.label}</span>
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
              aria-label={option.label}
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
  onBack,
  onPick,
}: {
  cast: Cast;
  onBack: () => void;
  onPick: (storyId: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl leading-none">Elijan la aventura</h1>
          <p className="mt-2 max-w-xl font-comic text-lg leading-snug">
            {displayChild(cast.childName)} y {displayParent(cast.parentName, cast.role)} salen
            en las cuatro. Seis viñetas cada una, para leer juntos.
          </p>
        </div>
        <Button type="button" variant="outline" className="h-10 border-[3px] border-ink bg-white font-comic" onClick={onBack}>
          Cambiar nombres
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {STORIES.map((story, index) => (
          <article
            key={story.id}
            className="flex flex-col border-[3px] border-ink bg-sheet shadow-[5px_5px_0_#1c1917] motion-safe:transition-transform motion-safe:hover:-translate-y-0.5"
          >
            <div className="relative h-40 overflow-hidden border-b-[3px] border-ink">
              <Scene id={story.cover} />
              <div className="halftone pointer-events-none absolute inset-0" />
              <CastOnScene cast={cast} />
              <span className="absolute top-2 left-2 border-[3px] border-ink bg-comic-yellow px-2 font-display text-sm">
                N.º {index + 1}
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-3 p-4">
              <h2 className="font-display text-2xl leading-none">{story.title}</h2>
              <p className="font-comic text-base leading-snug">{story.blurb}</p>
              <Button
                type="button"
                className="mt-auto h-11 font-display tracking-wide"
                onClick={() => onPick(story.id)}
              >
                Leer este cómic
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
  const page = state.pageIndex >= 0 ? story.pages[state.pageIndex] : null;

  return (
    <div className="space-y-4">
      <div className="no-print flex flex-wrap items-center justify-between gap-2">
        <p className="font-comic text-base">
          {atStart
            ? "Portada"
            : `Página ${state.pageIndex + 1} de ${story.pages.length}`}
          <span className="text-muted-foreground"> · {story.title}</span>
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-10 border-[3px] border-ink bg-white font-comic"
            onClick={onStories}
          >
            Otras aventuras
          </Button>
          <Button
            type="button"
            variant={editingAll ? "default" : "outline"}
            className="h-10 border-[3px] border-ink font-comic"
            aria-pressed={editingAll}
            onClick={onToggleEdit}
          >
            {editingAll ? "Listo, ya se lee" : "Escribir las frases"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-10 border-[3px] border-ink bg-white font-comic"
            onClick={() => window.print()}
          >
            Imprimir
          </Button>
        </div>
      </div>

      <div className="comic-sheet no-print flex overflow-hidden border-[4px] border-ink bg-sheet shadow-[8px_8px_0_#1c1917]">
        <div className="hidden w-7 shrink-0 bg-[#9b2331] sm:block" />
        <div className="min-w-0 flex-1 p-3 sm:p-5">
          {atStart || !page ? (
            <CoverCard
              cast={state.cast}
              title={story.title}
              kicker={`${story.title}`}
              issue={STORIES.findIndex((item) => item.id === story.id) + 1}
            />
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {page.panels.map((panel) => (
                <PanelView
                  key={panel.id}
                  panel={panel}
                  cast={state.cast}
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
              FIN
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
          Anterior
        </Button>
        <nav className="flex items-center gap-1" aria-label="Páginas del cómic">
          <button
            type="button"
            aria-label="Portada"
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
              aria-label={`Página ${index + 1}`}
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
              Leer otra vez
            </Button>
            <Button type="button" className="h-12 px-4 font-display" onClick={onStories}>
              Otra aventura
            </Button>
          </div>
        ) : (
          <Button type="button" className="h-12 px-5 font-display text-base" onClick={onNext}>
            {atStart ? "Abrir el cómic" : "Siguiente"}
          </Button>
        )}
      </div>
      <p className="no-print text-center font-comic text-sm text-muted-foreground">
        Una voz lee los globos de ella. La otra, los de {roleWord(state.cast.role)}.
        Las flechas del teclado también pasan la página.
      </p>

      <div className="hidden print:block">
        <p className="font-display text-3xl">{story.title}</p>
        <p className="mb-4 font-comic text-lg">
          {displayChild(state.cast.childName)} y {displayParent(state.cast.parentName, state.cast.role)}
        </p>
        <div className="grid gap-4">
          {story.pages.map((storyPage) => (
            <div key={storyPage.id} className="grid gap-3 md:grid-cols-2">
              {storyPage.panels.map((panel) => (
                <PanelView
                  key={`print-${panel.id}`}
                  panel={panel}
                  cast={state.cast}
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
  title,
  kicker,
  issue,
}: {
  cast: Cast;
  title: string;
  kicker: string;
  issue?: number;
}) {
  return (
    <div className="relative flex min-h-[520px] flex-col overflow-hidden border-[3px] border-ink bg-[#8ecae6]">
      <Scene id="garden" />
      <div className="halftone pointer-events-none absolute inset-0" />
      <div className="relative z-20 flex flex-col items-center px-4 pt-5 text-center">
        <div className="w-full max-w-md border-[3px] border-ink bg-sheet/95 px-4 py-4 shadow-[4px_4px_0_#1c1917]">
          <p className="font-comic text-xs font-bold tracking-[0.18em] uppercase">
            {issue ? `N.º ${issue} · para leer juntos` : kicker}
          </p>
          <h2 className="mt-1 font-display text-4xl leading-[0.95] text-balance sm:text-5xl">{title}</h2>
          <p className="mt-2 font-comic text-lg leading-snug font-bold text-balance">
            {displayChild(cast.childName)} y {displayParent(cast.parentName, cast.role)}
          </p>
          <p className="font-comic text-base text-balance">
            Para quien colecciona {cast.favorite}.
          </p>
        </div>
      </div>
      <div className="relative z-10 mt-auto h-60 sm:h-72">
        <CastOnScene cast={cast} />
      </div>
    </div>
  );
}

function CastOnScene({ cast }: { cast: Cast }) {
  return (
    <>
      <div className="absolute bottom-0 left-[8%] z-10 h-[92%]" style={{ aspectRatio: "160 / 230" }}>
        <Character who="child" hair={cast.childHair} skin={cast.childSkin} pose="wave" />
      </div>
      <div className="absolute right-[8%] bottom-0 z-10 h-full" style={{ aspectRatio: "160 / 230" }}>
        <Character who={cast.role} hair={cast.parentHair} skin={cast.parentSkin} pose="wave" flip />
      </div>
    </>
  );
}

function HowToRead() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="h-10 border-[3px] border-ink bg-white font-comic">
          Cómo leerlo
        </Button>
      </DialogTrigger>
      <DialogContent className="border-[3px] border-ink bg-sheet sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Cómo leerlo juntos</DialogTitle>
          <DialogDescription className="font-comic text-base text-ink">
            El cómic ya viene escrito. Ustedes le ponen la voz y, si quieren, el crayón.
          </DialogDescription>
        </DialogHeader>
        <ol className="list-decimal space-y-2 pl-5 font-comic text-base leading-snug">
          <li>Siéntense cerca, con la pantalla entre los dos.</li>
          <li>Una voz lee los globos de ella. La otra, los de mamá o papá.</li>
          <li>Si una frase no les suena, tóquenla y cámbienla.</li>
          <li>En la última página pueden dejarla como quieran recordarla.</li>
        </ol>
        <DialogClose asChild>
          <Button type="button" className="h-11 font-display">
            Entendido
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

function ResetDialog({ onReset }: { onReset: () => void }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="ghost" className="h-10 font-comic text-muted-foreground">
          Empezar de cero
        </Button>
      </DialogTrigger>
      <DialogContent className="border-[3px] border-ink bg-sheet sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">¿Empezamos de cero?</DialogTitle>
          <DialogDescription className="font-comic text-base text-ink">
            Se borran los nombres y las frases que hayan cambiado en este navegador.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="h-11 border-[3px] border-ink bg-white font-comic">
              Mejor no
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" className="h-11 font-display" onClick={onReset}>
              Sí, borrar
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
