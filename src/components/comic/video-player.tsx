"use client";

import { useEffect, useMemo, useState } from "react";
import { Character } from "@/components/comic/character";
import { PanelView } from "@/components/comic/panel";
import { Scene } from "@/components/comic/scenes";
import { Button } from "@/components/ui/button";
import {
  displayChild,
  displayParent,
  fill,
  type Cast,
  type ComicPanel,
  type Story,
} from "@/lib/comic";
import { STORIES } from "@/lib/stories";

type Slide = {
  id: string;
  ms: number;
  speech: string;
  kind: "cover" | "panel" | "end";
  panel?: ComicPanel;
  label: string;
};

export function VideoPlayer({
  cast,
  story,
  edits,
  onClose,
}: {
  cast: Cast;
  story: Story;
  edits: Record<string, string>;
  onClose: () => void;
}) {
  const slides = useMemo(() => buildSlides(story, cast, edits), [story, cast, edits]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [voice, setVoice] = useState(false);
  const [chrome, setChrome] = useState(true);
  const slide = slides[Math.min(index, slides.length - 1)];

  useEffect(() => {
    if (!playing || index >= slides.length - 1) return;
    const timer = window.setTimeout(() => {
      setIndex((current) => Math.min(slides.length - 1, current + 1));
    }, slide.ms);
    return () => window.clearTimeout(timer);
  }, [playing, index, slide.ms, slides.length]);

  useEffect(() => {
    if (!voice || !playing) {
      window.speechSynthesis?.cancel();
      return;
    }
    speak(slide.speech);
    return () => window.speechSynthesis?.cancel();
  }, [voice, playing, slide.speech]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
      if (event.key === " ") {
        event.preventDefault();
        setPlaying((current) => !current);
        setChrome(true);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setIndex((current) => Math.min(slides.length - 1, current + 1));
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setIndex((current) => Math.max(0, current - 1));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function close() {
    window.speechSynthesis?.cancel();
    if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => undefined);
    }
    onClose();
  }

  async function fillScreen() {
    setChrome(false);
    const node = document.getElementById("comic-video");
    if (node && !document.fullscreenElement) {
      await node.requestFullscreen().catch(() => undefined);
    }
  }

  return (
    <div
      id="comic-video"
      className="fixed inset-0 z-50 flex flex-col bg-paper text-ink"
      role="dialog"
      aria-modal="true"
      aria-label={`Video de ${story.title}`}
    >
      <button
        type="button"
        className="relative flex min-h-0 flex-1 items-center justify-center px-3 py-4 sm:px-8"
        onClick={() => setChrome(true)}
        aria-label="Mostrar los controles"
      >
        <div className="w-full max-w-3xl">
          {slide.kind === "panel" && slide.panel ? (
            <div className="pointer-events-none">
              <PanelView
                panel={slide.panel}
                cast={cast}
                edits={edits}
                editingAll={false}
                activeBubble={null}
                onActivate={() => undefined}
                onChange={() => undefined}
                className="min-h-[460px] shadow-[8px_8px_0_#1c1917]"
              />
            </div>
          ) : (
            <TitleSlide cast={cast} story={story} end={slide.kind === "end"} />
          )}
        </div>
      </button>

      <div className={chrome ? "border-t-[3px] border-ink bg-sheet px-3 py-3 sm:px-6" : "sr-only"}>
        <div className="mx-auto flex max-w-3xl flex-col gap-3">
          <div className="flex items-center gap-3">
            <div
              className="h-2 flex-1 border-2 border-ink bg-white"
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={slides.length}
              aria-valuenow={index + 1}
              aria-label={slide.label}
            >
              <div
                className="h-full bg-comic-red"
                style={{ width: `${((index + 1) / slides.length) * 100}%` }}
              />
            </div>
            <p className="font-comic text-sm font-bold whitespace-nowrap">{slide.label}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" className="h-10 font-display" onClick={() => setPlaying((value) => !value)}>
              {playing ? "Pausa" : "Seguir"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 border-[3px] border-ink bg-white font-comic"
              onClick={() => setIndex((current) => Math.max(0, current - 1))}
              disabled={index === 0}
            >
              Anterior
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 border-[3px] border-ink bg-white font-comic"
              onClick={() => setIndex((current) => Math.min(slides.length - 1, current + 1))}
              disabled={index >= slides.length - 1}
            >
              Siguiente
            </Button>
            <Button
              type="button"
              variant={voice ? "default" : "outline"}
              className="h-10 border-[3px] border-ink font-comic"
              aria-pressed={voice}
              onClick={() => setVoice((value) => !value)}
            >
              {voice ? "Voz encendida" : "Poner voz"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 border-[3px] border-ink bg-white font-comic"
              onClick={() => void fillScreen()}
            >
              Grabar en grande
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="h-10 font-comic"
              onClick={close}
            >
              Volver al cómic
            </Button>
          </div>
          <p className="font-comic text-sm text-muted-foreground">
            Si esta versión te gusta, ponla en grande y grábala con la pantalla del celular o de la computadora. La voz es opcional.
          </p>
        </div>
      </div>
    </div>
  );
}

function TitleSlide({
  cast,
  story,
  end,
}: {
  cast: Cast;
  story: Story;
  end: boolean;
}) {
  const issue = STORIES.findIndex((item) => item.id === story.id) + 1;
  return (
    <div className="relative flex min-h-[460px] flex-col overflow-hidden border-[4px] border-ink bg-[#8ecae6] shadow-[8px_8px_0_#1c1917]">
      <Scene id={end ? "garden-hug" : story.cover} />
      <div className="halftone pointer-events-none absolute inset-0" />
      <div className="relative z-20 px-4 pt-6 text-center">
        <div className="mx-auto max-w-md border-[3px] border-ink bg-sheet/95 px-4 py-4 shadow-[4px_4px_0_#1c1917]">
          <p className="font-comic text-xs font-bold tracking-[0.16em] uppercase">
            {end ? "Así termina" : `N.º ${issue} · para ver juntos`}
          </p>
          <h2 className="mt-1 font-display text-4xl leading-none text-balance sm:text-5xl">
            {end ? "Fin" : story.title}
          </h2>
          <p className="mt-2 font-comic text-lg font-bold">
            {displayChild(cast.childName)} y {displayParent(cast.parentName, cast.role)}
          </p>
        </div>
      </div>
      <div className="relative z-10 mt-auto h-56">
        <div className="absolute bottom-0 left-[10%] h-[92%]" style={{ aspectRatio: "160 / 230" }}>
          <Character who="child" hair={cast.childHair} skin={cast.childSkin} pose={end ? "hug" : "wave"} />
        </div>
        <div className="absolute right-[10%] bottom-0 h-full" style={{ aspectRatio: "160 / 230" }}>
          <Character
            who={cast.role}
            hair={cast.parentHair}
            skin={cast.parentSkin}
            pose={end ? "hug" : "wave"}
            flip
          />
        </div>
      </div>
    </div>
  );
}

function buildSlides(story: Story, cast: Cast, edits: Record<string, string>): Slide[] {
  const names = `${displayChild(cast.childName)} y ${displayParent(cast.parentName, cast.role)}`;
  const panels = story.pages.flatMap((page) => page.panels);
  const cover: Slide = {
    id: "cover",
    kind: "cover",
    ms: 6500,
    label: "Portada",
    speech: `${story.title}. Las aventuras de ${names}.`,
  };
  const frames: Slide[] = panels.map((panel, position) => {
    const spoken = spokenPanel(panel, cast, edits);
    return {
      id: panel.id,
      kind: "panel",
      panel,
      ms: Math.min(16000, Math.max(7000, 2400 + spoken.length * 68)),
      label: `Viñeta ${position + 1} de ${panels.length}`,
      speech: spoken,
    };
  });
  const end: Slide = {
    id: "end",
    kind: "end",
    ms: 7000,
    label: "Fin",
    speech: `Fin. ${story.title}, de ${names}.`,
  };
  return [cover, ...frames, end];
}

function spokenPanel(panel: ComicPanel, cast: Cast, edits: Record<string, string>) {
  const lines = [
    panel.caption ? fill(panel.caption, cast) : "",
    ...panel.bubbles.map((bubble) => {
      const name = bubble.speaker === "child" ? displayChild(cast.childName) : displayParent(cast.parentName, cast.role);
      const text = edits[bubble.id] ?? fill(bubble.text, cast);
      return `${name} dice: ${text}`;
    }),
  ];
  return lines.filter(Boolean).join(". ");
}

function speak(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-MX";
  utterance.rate = 0.92;
  const voice = window.speechSynthesis
    .getVoices()
    .find((item) => item.lang.toLowerCase().startsWith("es"));
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}
