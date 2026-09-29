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
  hug: { dy: 0, leftArm: 16, rightArm: -78, leftLeg: 3, rightLeg: -3, leg: 40 },
  play: { dy: 0, leftArm: 36, rightArm: -108, leftLeg: 6, rightLeg: -8, leg: 40 },
  jump: { dy: -16, leftArm: 148, rightArm: -150, leftLeg: -24, rightLeg: 26, leg: 40 },
  peek: { dy: 2, leftArm: 20, rightArm: -118, leftLeg: 4, rightLeg: -4, leg: 40 },
  kneel: { dy: 8, leftArm: 22, rightArm: -18, leftLeg: 16, rightLeg: -14, leg: 32 },
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
  const shirt = child ? "#ef5d56" : dad ? "#f4efe6" : "#e07a5f";
  const pants = child ? skin : dad ? "#8a7a58" : "#1d3557";
  const shoe = child ? "#d62828" : dad ? "#3d2b1f" : "#6b3a22";
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
        <ellipse cx="108" cy="76" rx="6" ry="3.2" fill="#e88888" opacity="0.35" />
        {dad && (
          <>
            <rect x="50" y="57" width="24" height="16" rx="4" fill="none" stroke={INK} strokeWidth="2.6" />
            <rect x="86" y="57" width="24" height="16" rx="4" fill="none" stroke={INK} strokeWidth="2.6" />
            <path d="M74 65 H86" stroke={INK} strokeWidth="2.6" />
            <path d="M66 74 Q74 79 80 74 Q86 79 94 74" fill={hair} />
            <path
              d="M62 82 Q66 98 80 102 Q94 98 98 82 Q92 90 80 91 Q68 90 62 82"
              fill={hair}
              stroke={INK}
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
          </>
        )}
      </g>
    </svg>
  );
}

function HairBack({ who, hair }: { who: Who; hair: string }) {
  if (who === "papa") {
    return (
      <path
        d="M52 56 Q48 18 80 14 Q116 18 110 56 Q104 30 80 26 Q58 30 52 56"
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
    <>
      <path
        d="M42 78 Q32 128 50 146 Q80 118 110 146 Q128 128 118 74 Q112 20 80 14 Q48 20 42 78"
        fill={hair}
        stroke={INK}
        strokeWidth={STROKE}
        strokeLinejoin="round"
      />
      <path
        d="M74 18 C78 -2 96 2 88 20"
        fill={hair}
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </>
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
  if (who === "child") {
    return (
      <path
        d="M50 60 Q66 42 82 54 Q104 40 114 64 Q98 50 76 56 Q58 50 50 60"
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
        <Star x={68} y={122} />
        <Star x={90} y={118} />
        <Star x={78} y={136} />
        <Star x={100} y={134} />
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
          d="M48 104 Q80 92 112 104 L118 150 Q80 160 42 150 Z"
          fill={shirt}
          stroke={INK}
          strokeWidth={STROKE}
          strokeLinejoin="round"
        />
        <path d="M80 110 L92 148 H68 Z" fill="#fff8ea" stroke={INK} strokeWidth="3" />
      </>
    );
  }

  return (
    <path
      d="M50 104 Q80 94 110 104 L116 148 Q80 158 44 148 Z"
      fill={shirt}
      stroke={INK}
      strokeWidth={STROKE}
      strokeLinejoin="round"
    />
  );
}

function Star({ x, y }: { x: number; y: number }) {
  return (
    <path
      d={`M${x} ${y - 6} L${x + 1.8} ${y - 1.6} L${x + 6.2} ${y - 1.2} L${x + 2.8} ${y + 2} L${x + 3.8} ${y + 6.4} L${x} ${y + 3.6} L${x - 3.8} ${y + 6.4} L${x - 2.8} ${y + 2} L${x - 6.2} ${y - 1.2} L${x - 1.8} ${y - 1.6} Z`}
      fill="#fff8ea"
      stroke={INK}
      strokeWidth="1.4"
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
    <g transform={`rotate(${angle} ${ox} 152)`}>
      <rect
        x={ox - 8}
        y={146}
        width={16}
        height={length + 18}
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
