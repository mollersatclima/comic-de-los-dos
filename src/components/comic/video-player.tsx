"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { Character } from "@/components/comic/character";
import { PanelView } from "@/components/comic/panel";
import { Scene } from "@/components/comic/scenes";
import { Button } from "@/components/ui/button";
import {
  displayChild,
  displayParent,
  type Cast,
  type ComicPanel,
  type Lang,
  type Story,
} from "@/lib/comic";
import { say, t } from "@/lib/i18n";
import { scoreIsOn, scoreServerOff, setBed, setScore, subscribeScore } from "@/lib/score";
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
  lang,
  edits,
  onClose,
}: {
  cast: Cast;
  story: Story;
  lang: Lang;
  edits: Record<string, string>;
  onClose: () => void;
}) {
  const slides = useMemo(() => buildSlides(story, cast, lang, edits), [story, cast, lang, edits]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [voice, setVoice] = useState(true);
  const [chrome, setChrome] = useState(true);
  const music = useSyncExternalStore(subscribeScore, scoreIsOn, scoreServerOff);
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
    speak(slide.speech, t(lang, "speechLang"));
    return () => window.speechSynthesis?.cancel();
  }, [voice, playing, slide.speech, lang]);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (!scoreIsOn()) return;
      if (!playing) {
        setBed("quiet");
        return;
      }
      const speaking =
        voice &&
        (window.speechSynthesis?.speaking || window.speechSynthesis?.pending);
      setBed(speaking ? "talk" : "play");
    }, 140);
    return () => window.clearInterval(id);
  }, [playing, voice]);

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
      aria-label={`${t(lang, "videoOf")} ${say(lang, story.title, cast)}`}
    >
      <button
        type="button"
        className="relative flex min-h-0 flex-1 items-center justify-center px-3 py-4 sm:px-8"
        onClick={() => setChrome(true)}
        aria-label={t(lang, "showControls")}
      >
        <div className="w-full max-w-3xl">
          {slide.kind === "panel" && slide.panel ? (
            <div className="pointer-events-none">
              <PanelView
                panel={slide.panel}
                cast={cast}
                lang={lang}
                edits={edits}
                editingAll={false}
                activeBubble={null}
                onActivate={() => undefined}
                onChange={() => undefined}
                className="min-h-[460px] shadow-[8px_8px_0_#1b2a4a]"
              />
            </div>
          ) : (
            <TitleSlide cast={cast} story={story} lang={lang} end={slide.kind === "end"} />
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
              {playing ? t(lang, "pause") : t(lang, "resume")}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 border-[3px] border-ink bg-white font-comic"
              onClick={() => setIndex((current) => Math.max(0, current - 1))}
              disabled={index === 0}
            >
              {t(lang, "previous")}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 border-[3px] border-ink bg-white font-comic"
              onClick={() => setIndex((current) => Math.min(slides.length - 1, current + 1))}
              disabled={index >= slides.length - 1}
            >
              {t(lang, "next")}
            </Button>
            <Button
              type="button"
              variant={voice ? "default" : "outline"}
              className="h-10 border-[3px] border-ink font-comic"
              aria-pressed={voice}
              onClick={() => setVoice((value) => !value)}
            >
              {voice ? t(lang, "voiceOn") : t(lang, "voiceOff")}
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
              onClick={() => void fillScreen()}
            >
              {t(lang, "recordBig")}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="h-10 font-comic"
              onClick={close}
            >
              {t(lang, "backToComic")}
            </Button>
          </div>
          <p className="font-comic text-sm text-muted-foreground">
            {t(lang, "ifYouLike")}
          </p>
        </div>
      </div>
    </div>
  );
}

function TitleSlide({
  cast,
  story,
  lang,
  end,
}: {
  cast: Cast;
  story: Story;
  lang: Lang;
  end: boolean;
}) {
  const issue = STORIES.findIndex((item) => item.id === story.id) + 1;
  const coverArt = !end ? story.coverArt : "/art/scene-3b.png";
  return (
    <div className="relative flex min-h-[460px] flex-col overflow-hidden border-[4px] border-ink bg-[#8ecae6] shadow-[8px_8px_0_#1b2a4a]">
      {coverArt ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverArt}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1b2a4a]/45 via-transparent to-[#1b2a4a]/60" />
        </>
      ) : (
        <>
          <Scene id={end ? "garden-hug" : story.cover} />
          <div className="halftone pointer-events-none absolute inset-0" />
        </>
      )}
      <div className="relative z-20 px-4 pt-6 text-center">
        <div className="mx-auto max-w-md border-[3px] border-ink bg-sheet/95 px-4 py-4 shadow-[4px_4px_0_#1b2a4a]">
          <p className="font-comic text-xs font-bold tracking-[0.16em] uppercase">
            {end ? t(lang, "endsLike") : `N.º ${issue} · ${t(lang, "toWatch")}`}
          </p>
          <h2 className="mt-1 font-display text-4xl leading-none text-balance sm:text-5xl">
            {end ? t(lang, "end") : say(lang, story.title, cast)}
          </h2>
          <p className="mt-2 font-comic text-lg font-bold">
            {displayChild(cast.childName, lang)} {t(lang, "and")} {displayParent(cast.parentName, cast.role, lang)}
          </p>
        </div>
      </div>
      {!coverArt && (
        <div className="relative z-10 mt-auto h-56">
          {story.id === "espejo" && !end ? (
            <>
              <div className="absolute bottom-0 left-[8%] h-full" style={{ aspectRatio: "160 / 230" }}>
                <Character who={cast.role} hair={cast.parentHair} skin={cast.parentSkin} pose="wave" />
              </div>
              <div className="absolute right-[8%] bottom-0 h-[92%]" style={{ aspectRatio: "160 / 230" }}>
                <Character who="child" hair={cast.childHair} skin={cast.childSkin} pose="wave" flip />
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      )}
    </div>
  );
}

function buildSlides(story: Story, cast: Cast, lang: Lang, edits: Record<string, string>): Slide[] {
  const names = `${displayChild(cast.childName, lang)} ${t(lang, "and")} ${displayParent(cast.parentName, cast.role, lang)}`;
  const title = say(lang, story.title, cast);
  const panels = story.pages.flatMap((page) => page.panels);
  const cover: Slide = {
    id: "cover",
    kind: "cover",
    ms: 6500,
    label: t(lang, "cover"),
    speech: `${title}. ${t(lang, "adventuresOf")} ${names}.`,
  };
  const frames: Slide[] = panels.map((panel, position) => {
    const spoken = spokenPanel(panel, cast, lang, edits);
    return {
      id: panel.id,
      kind: "panel",
      panel,
      ms: Math.min(16000, Math.max(7000, 2400 + spoken.length * 68)),
      label: `${t(lang, "panel")} ${position + 1} ${t(lang, "of")} ${panels.length}`,
      speech: spoken,
    };
  });
  const end: Slide = {
    id: "end",
    kind: "end",
    ms: 7000,
    label: t(lang, "end"),
    speech: `${t(lang, "end")}. ${title}, ${t(lang, "ofNames")} ${names}.`,
  };
  return [cover, ...frames, end];
}

function spokenPanel(panel: ComicPanel, cast: Cast, lang: Lang, edits: Record<string, string>) {
  const lines = [
    panel.caption ? say(lang, panel.caption, cast) : "",
    ...panel.bubbles.map((bubble) => {
      const name =
        bubble.speaker === "child"
          ? displayChild(cast.childName, lang)
          : displayParent(cast.parentName, cast.role, lang);
      const text = edits[bubble.id] ?? say(lang, bubble.text, cast);
      return `${name} ${t(lang, "says")}: ${text}`;
    }),
  ];
  return lines.filter(Boolean).join(". ");
}

function speak(text: string, speechLang: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = speechLang;
  utterance.rate = 0.92;
  const voice = window.speechSynthesis
    .getVoices()
    .find((item) => item.lang.toLowerCase().startsWith(speechLang.slice(0, 2)));
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}
