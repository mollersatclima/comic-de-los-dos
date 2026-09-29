"use client";

import { Character } from "@/components/comic/character";
import { Scene } from "@/components/comic/scenes";
import type { Cast, ComicPanel } from "@/lib/comic";
import { fill } from "@/lib/comic";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function PanelView({
  panel,
  cast,
  edits,
  editingAll,
  activeBubble,
  onActivate,
  onChange,
  className,
}: {
  panel: ComicPanel;
  cast: Cast;
  edits: Record<string, string>;
  editingAll: boolean;
  activeBubble: string | null;
  onActivate: (id: string) => void;
  onChange: (id: string, value: string) => void;
  className?: string;
}) {
  const childBubble = panel.bubbles.find((bubble) => bubble.speaker === "child");
  const parentBubble = panel.bubbles.find((bubble) => bubble.speaker === "parent");

  return (
    <figure
      className={cn(
        "print-panel flex min-h-[420px] flex-col overflow-hidden border-[3px] border-ink bg-white",
        className,
      )}
    >
      <div className="relative z-20 flex flex-col gap-2 px-3 pt-3">
        {panel.caption && (
          <figcaption className="max-w-full self-start border-[3px] border-ink bg-comic-yellow px-2.5 py-1 font-comic text-[15px] leading-snug font-bold text-ink shadow-[3px_3px_0_#1b2a4a]">
            {fill(panel.caption, cast)}
          </figcaption>
        )}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {childBubble && (
            <Speech
              name={fill("{{child}}", cast)}
              text={edits[childBubble.id] ?? fill(childBubble.text, cast)}
              side="left"
              editing={editingAll || activeBubble === childBubble.id}
              onActivate={() => onActivate(childBubble.id)}
              onChange={(value) => onChange(childBubble.id, value)}
            />
          )}
          {parentBubble && (
            <Speech
              name={fill("{{parent}}", cast)}
              text={edits[parentBubble.id] ?? fill(parentBubble.text, cast)}
              side="right"
              editing={editingAll || activeBubble === parentBubble.id}
              onActivate={() => onActivate(parentBubble.id)}
              onChange={(value) => onChange(parentBubble.id, value)}
            />
          )}
        </div>
        {panel.sfx && (
          <p className="sfx-stroke pointer-events-none relative z-30 -mb-5 text-center font-display text-[2rem] leading-none text-comic-red">
            {panel.sfx}
          </p>
        )}
      </div>
      <div className="relative mt-1 min-h-[230px] flex-1">
        <Scene id={panel.scene} />
        <div className="halftone pointer-events-none absolute inset-0" />
        {panel.actors.map((actor, index) => (
          <div
            key={`${actor.who}-${index}`}
            className="absolute bottom-0 z-10"
            style={{
              left: actor.x,
              height: actor.who === "child" ? "78%" : "86%",
              aspectRatio: "160 / 230",
              zIndex: index + 1,
            }}
          >
            <Character
              who={actor.who === "child" ? "child" : cast.role}
              hair={actor.who === "child" ? cast.childHair : cast.parentHair}
              skin={actor.who === "child" ? cast.childSkin : cast.parentSkin}
              pose={actor.pose}
              flip={actor.flip}
            />
          </div>
        ))}
      </div>
    </figure>
  );
}

function Speech({
  name,
  text,
  side,
  editing,
  onActivate,
  onChange,
}: {
  name: string;
  text: string;
  side: "left" | "right";
  editing: boolean;
  onActivate: () => void;
  onChange: (value: string) => void;
}) {
  return (
    <div className={cn("relative max-w-full", side === "right" && "sm:justify-self-end")}>
      <div
        className={cn(
          "relative rounded-[1.6rem] border-[3px] border-ink px-3 py-2 shadow-[3px_3px_0_#1b2a4a]",
          side === "left" ? "bg-[#fff4f8]" : "bg-[#f3f7ff]",
        )}
      >
        <p
          className={cn(
            "font-display text-[11px] tracking-[0.14em] uppercase",
            side === "left" ? "text-comic-red" : "text-comic-navy",
          )}
        >
          {name}
        </p>
        {editing ? (
          <Textarea
            value={text}
            onChange={(event) => onChange(event.target.value)}
            maxLength={160}
            rows={3}
            aria-label={`Lo que dice ${name}`}
            className="mt-1 min-h-16 resize-none border-ink bg-sheet font-comic text-base font-bold text-ink"
          />
        ) : (
          <button
            type="button"
            onClick={onActivate}
            className="mt-0.5 block w-full rounded-md text-left font-comic text-[15px] leading-snug font-bold text-ink focus-visible:ring-3 focus-visible:ring-comic-red/40 sm:text-base"
          >
            {text}
            <span className="sr-only">Toca para cambiar esta frase</span>
          </button>
        )}
        <span
          aria-hidden
          className={cn(
            "absolute -bottom-[11px] size-4 rotate-45 border-r-[3px] border-b-[3px] border-ink",
            side === "left" ? "bg-[#fff4f8]" : "bg-[#f3f7ff]",
            side === "left" ? "left-6" : "right-6",
          )}
        />
      </div>
    </div>
  );
}
