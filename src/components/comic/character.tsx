"use client";

import type { Pose } from "@/lib/comic";
import { cn } from "@/lib/utils";

const INK = "#1c1917";
const STROKE = 3.5;

type Who = "child" | "mama" | "papa";

const POSE: Record<
  Pose,
  { dy: number; leftArm: number; rightArm: number; leftLeg: number; rightLeg: number; leg: number }
> = {
  stand: { dy: 0, leftArm: 14, rightArm: -12, leftLeg: 5, rightLeg: -5, leg: 40 },
  wave: { dy: 0, leftArm: 12, rightArm: -158, leftLeg: 4, rightLeg: -6, leg: 40 },
  point: { dy: 0, leftArm: 18, rightArm: -78, leftLeg: 6, rightLeg: -4, leg: 40 },
  cheer: { dy: -4, leftArm: 158, rightArm: -156, leftLeg: -8, rightLeg: 10, leg: 40 },
  hug: { dy: 0, leftArm: 58, rightArm: -58, leftLeg: 3, rightLeg: -3, leg: 40 },
  play: { dy: 0, leftArm: 36, rightArm: -108, leftLeg: 6, rightLeg: -8, leg: 40 },
  jump: { dy: -16, leftArm: 148, rightArm: -150, leftLeg: -24, rightLeg: 26, leg: 40 },
  peek: { dy: 2, leftArm: 20, rightArm: -118, leftLeg: 4, rightLeg: -4, leg: 40 },
  kneel: { dy: 14, leftArm: 24, rightArm: -20, leftLeg: 48, rightLeg: -42, leg: 22 },
};

export function Character({
  who,
  hair,
  skin,
  pose = "stand",
  flip = false,
}: {
  who: Who;
  hair: string;
  skin: string;
  pose?: Pose;
  flip?: boolean;
}) {
  const poseData = POSE[pose];
  const child = who === "child";
  const dad = who === "papa";
  const shirt = child ? "#f4b942" : dad ? "#1d3557" : "#e07a5f";
  const pants = child ? skin : dad ? "#c4a574" : "#1d3557";
  const shoe = child ? "#d62828" : dad ? "#3d2b1f" : "#6b3a22";
  const bow = hair.toLowerCase() === "#c4491d" ? "#ffe08a" : "#d62828";
  const openMouth = pose === "cheer" || pose === "jump";

  return (
    <svg
      viewBox="0 0 160 230"
      className={cn("h-full w-full overflow-visible", flip && "-scale-x-100")}
      aria-hidden
    >
      <ellipse cx="80" cy="216" rx="34" ry="6" fill={INK} opacity="0.14" />
      <g transform={`translate(0 ${poseData.dy})`}>
        <HairBack who={who} hair={hair} />
        <circle cx="50" cy="70" r="7" fill={skin} stroke={INK} strokeWidth={STROKE} />
        <circle cx="110" cy="70" r="7" fill={skin} stroke={INK} strokeWidth={STROKE} />
        <rect x="72" y="86" width="16" height="22" fill={skin} />
        <Leg
          ox={66}
          angle={poseData.leftLeg}
          length={poseData.leg}
          pants={pants}
          shoe={shoe}
        />
        <Leg
          ox={94}
          angle={poseData.rightLeg}
          length={poseData.leg}
          pants={pants}
          shoe={shoe}
        />
        <Clothes who={who} shirt={shirt} />
        <Arm angle={poseData.leftArm} ox={50} skin={skin} sleeve={shirt} />
        <Arm angle={poseData.rightArm} ox={110} skin={skin} sleeve={shirt} />
        <circle cx="80" cy="64" r="30" fill={skin} stroke={INK} strokeWidth={STROKE} />
        <HairFront who={who} hair={hair} />
        <ellipse cx="62" cy="66" rx={child ? 4.6 : 3.6} ry={child ? 5.6 : 4.4} fill={INK} />
        <ellipse cx="98" cy="66" rx={child ? 4.6 : 3.6} ry={child ? 5.6 : 4.4} fill={INK} />
        <circle cx="63.4" cy="64.2" r="1.5" fill="#fff" />
        <circle cx="99.4" cy="64.2" r="1.5" fill="#fff" />
        {!child && (
          <>
            <path d="M54 56 Q62 52 70 56" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
            <path d="M90 56 Q98 52 106 56" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
          </>
        )}
        {openMouth ? (
          <path d="M68 78 Q80 92 92 78 Q80 84 68 78" fill={INK} />
        ) : (
          <path
            d="M66 78 Q80 90 94 78"
            fill="none"
            stroke={INK}
            strokeWidth="3"
            strokeLinecap="round"
          />
        )}
        <ellipse cx="52" cy="76" rx="6" ry="3.2" fill="#e88888" opacity="0.4" />
        <ellipse cx="108" cy="76" rx="6" ry="3.2" fill="#e88888" opacity="0.4" />
        {dad && (
          <path
            d="M58 80 Q80 104 102 80 Q94 90 80 92 Q66 90 58 80"
            fill={hair}
            stroke={INK}
            strokeWidth="3"
          />
        )}
        {child && (
          <g transform="translate(112 62)">
            <ellipse cx="-9" cy="0" rx="8" ry="5.5" fill={bow} stroke={INK} strokeWidth="2.4" />
            <ellipse cx="9" cy="0" rx="8" ry="5.5" fill={bow} stroke={INK} strokeWidth="2.4" />
            <circle r="4.2" fill={bow} stroke={INK} strokeWidth="2.4" />
          </g>
        )}
      </g>
    </svg>
  );
}

function HairBack({ who, hair }: { who: Who; hair: string }) {
  if (who === "papa") {
    return (
      <path
        d="M50 58 Q48 28 80 24 Q112 28 110 58 Q104 36 80 34 Q56 36 50 58"
        fill={hair}
        stroke={INK}
        strokeWidth={STROKE}
        strokeLinejoin="round"
      />
    );
  }
  if (who === "mama") {
    return (
      <path
        d="M42 70 Q34 120 50 132 Q80 104 110 132 Q126 120 118 64 Q112 22 80 18 Q48 22 42 70"
        fill={hair}
        stroke={INK}
        strokeWidth={STROKE}
        strokeLinejoin="round"
      />
    );
  }
  return (
    <path
      d="M46 66 Q40 28 80 22 Q120 28 114 70 Q108 40 80 36 Q54 40 46 66"
      fill={hair}
      stroke={INK}
      strokeWidth={STROKE}
      strokeLinejoin="round"
    />
  );
}

function HairFront({ who, hair }: { who: Who; hair: string }) {
  if (who === "papa") {
    return (
      <path
        d="M52 52 Q80 36 108 52 Q100 46 80 46 Q60 46 52 52"
        fill={hair}
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
    );
  }
  return (
    <path
      d="M50 58 Q62 40 80 48 Q98 38 110 58 Q100 48 80 52 Q62 50 50 58"
      fill={hair}
      stroke={INK}
      strokeWidth="3"
      strokeLinejoin="round"
    />
  );
}

function Clothes({ who, shirt }: { who: Who; shirt: string }) {
  if (who === "child") {
    return (
      <>
        <path
          d="M52 104 Q80 92 108 104 L116 150 Q80 162 44 150 Z"
          fill={shirt}
          stroke={INK}
          strokeWidth={STROKE}
          strokeLinejoin="round"
        />
        <path d="M60 118 H102" stroke="#fff8ea" strokeWidth="6" strokeLinecap="round" />
        <path d="M56 132 H106" stroke="#fff8ea" strokeWidth="6" strokeLinecap="round" />
        <path
          d="M48 146 H112 L118 176 Q80 188 42 176 Z"
          fill="#3d5a80"
          stroke={INK}
          strokeWidth={STROKE}
          strokeLinejoin="round"
        />
      </>
    );
  }

  if (who === "mama") {
    return (
      <>
        <path
          d="M46 102 Q80 90 114 102 L124 164 Q80 176 36 164 Z"
          fill={shirt}
          stroke={INK}
          strokeWidth={STROKE}
          strokeLinejoin="round"
        />
        <path d="M80 108 L94 160 H66 Z" fill="#fff8ea" stroke={INK} strokeWidth="3" />
        <path
          d="M58 112 H74"
          fill="none"
          stroke={INK}
          strokeWidth="3"
          strokeLinecap="round"
        />
      </>
    );
  }

  return (
    <path
      d="M48 102 Q80 90 112 102 L122 166 Q80 178 38 166 Z"
      fill={shirt}
      stroke={INK}
      strokeWidth={STROKE}
      strokeLinejoin="round"
    />
  );
}

function Arm({
  angle,
  ox,
  skin,
  sleeve,
}: {
  angle: number;
  ox: number;
  skin: string;
  sleeve: string;
}) {
  return (
    <g transform={`rotate(${angle} ${ox} 112)`}>
      <rect
        x={ox - 8}
        y={108}
        width={16}
        height={44}
        rx={8}
        fill={skin}
        stroke={INK}
        strokeWidth={STROKE}
      />
      <rect
        x={ox - 9}
        y={104}
        width={18}
        height={16}
        rx={6}
        fill={sleeve}
        stroke={INK}
        strokeWidth={STROKE}
      />
    </g>
  );
}

function Leg({
  ox,
  angle,
  length,
  pants,
  shoe,
}: {
  ox: number;
  angle: number;
  length: number;
  pants: string;
  shoe: string;
}) {
  return (
    <g transform={`rotate(${angle} ${ox} 168)`}>
      <rect
        x={ox - 8}
        y={164}
        width={16}
        height={length}
        rx={8}
        fill={pants}
        stroke={INK}
        strokeWidth={STROKE}
      />
      <ellipse
        cx={ox + 2}
        cy={164 + length + 2}
        rx={12}
        ry={7}
        fill={shoe}
        stroke={INK}
        strokeWidth={STROKE}
      />
    </g>
  );
}
