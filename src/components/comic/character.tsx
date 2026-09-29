"use client";

import type { Pose } from "@/lib/comic";
import { cn } from "@/lib/utils";

const INK = "#1b2a4a";
const STROKE = 4;

type Who = "child" | "mama" | "papa";

const POSE: Record<
  Pose,
  { dy: number; leftArm: number; rightArm: number; leftLeg: number; rightLeg: number; leg: number }
> = {
  stand: { dy: 0, leftArm: 14, rightArm: -12, leftLeg: 5, rightLeg: -5, leg: 34 },
  wave: { dy: 0, leftArm: 12, rightArm: -158, leftLeg: 4, rightLeg: -6, leg: 34 },
  point: { dy: 0, leftArm: 18, rightArm: -78, leftLeg: 6, rightLeg: -4, leg: 34 },
  cheer: { dy: -4, leftArm: 158, rightArm: -156, leftLeg: -8, rightLeg: 10, leg: 34 },
  hug: { dy: 0, leftArm: 16, rightArm: -78, leftLeg: 3, rightLeg: -3, leg: 34 },
  play: { dy: 0, leftArm: 36, rightArm: -108, leftLeg: 6, rightLeg: -8, leg: 34 },
  jump: { dy: -16, leftArm: 148, rightArm: -150, leftLeg: -24, rightLeg: 26, leg: 34 },
  peek: { dy: 2, leftArm: 20, rightArm: -118, leftLeg: 4, rightLeg: -4, leg: 34 },
  kneel: { dy: 8, leftArm: 22, rightArm: -18, leftLeg: 16, rightLeg: -14, leg: 26 },
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
  const shoe = child ? "#ef3d6e" : dad ? "#3d2b1f" : "#6b3a22";
  const openMouth = pose === "cheer" || pose === "jump";
  const eye = child ? { rx: 8.2, ry: 10.2 } : { rx: 6.2, ry: 7.6 };

  return (
    <svg
      viewBox="0 0 160 230"
      className={cn("h-full w-full overflow-visible", flip && "-scale-x-100")}
      aria-hidden
    >
      <ellipse cx="80" cy="218" rx="36" ry="7" fill={INK} opacity="0.16" />
      <g transform={`translate(0 ${poseData.dy})`}>
        <HairBack who={who} hair={hair} />
        <circle cx="44" cy="74" r="9" fill={skin} stroke={INK} strokeWidth={STROKE} />
        <circle cx="116" cy="74" r="9" fill={skin} stroke={INK} strokeWidth={STROKE} />
        <rect x="70" y="96" width="20" height="18" rx="8" fill={skin} />
        <Leg ox={64} angle={poseData.leftLeg} length={poseData.leg} pants={pants} shoe={shoe} />
        <Leg ox={96} angle={poseData.rightLeg} length={poseData.leg} pants={pants} shoe={shoe} />
        <Clothes who={who} shirt={shirt} />
        <Arm angle={poseData.leftArm} ox={48} skin={skin} sleeve={shirt} />
        <Arm angle={poseData.rightArm} ox={112} skin={skin} sleeve={shirt} />
        <circle cx="80" cy="70" r="36" fill={skin} stroke={INK} strokeWidth={STROKE} />
        <HairFront who={who} hair={hair} />
        <ellipse cx="64" cy="70" rx={eye.rx} ry={eye.ry} fill={INK} />
        <ellipse cx="98" cy="70" rx={eye.rx} ry={eye.ry} fill={INK} />
        <circle cx="61" cy="66" r={child ? 2.7 : 2.1} fill="#fff" />
        <circle cx="95" cy="66" r={child ? 2.7 : 2.1} fill="#fff" />
        <circle cx="67.5" cy="73" r={child ? 1.15 : 0.9} fill="#fff" opacity="0.9" />
        <circle cx="101.5" cy="73" r={child ? 1.15 : 0.9} fill="#fff" opacity="0.9" />
        <ellipse cx="80" cy="82" rx="4.2" ry="3" fill="#e7a08a" />
        {openMouth ? (
          <path d="M64 88 Q80 108 96 88 Q80 96 64 88" fill={INK} />
        ) : (
          <path
            d="M62 88 Q80 102 98 88"
            fill="none"
            stroke={INK}
            strokeWidth="3.4"
            strokeLinecap="round"
          />
        )}
        <ellipse cx="48" cy="84" rx="8" ry="4.2" fill="#ef8b9a" opacity="0.55" />
        <ellipse cx="112" cy="84" rx="8" ry="4.2" fill="#ef8b9a" opacity="0.5" />
        {dad && <DadFace hair={hair} />}
      </g>
    </svg>
  );
}

function DadFace({ hair }: { hair: string }) {
  return (
    <>
      <path d="M50 58 Q62 52 74 60" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M86 60 Q98 52 110 58" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
      <rect x="46" y="60" width="30" height="20" rx="8" fill="none" stroke={INK} strokeWidth="3" />
      <rect x="84" y="60" width="30" height="20" rx="8" fill="none" stroke={INK} strokeWidth="3" />
      <path d="M76 70 H84" stroke={INK} strokeWidth="3" />
      <path d="M64 86 Q74 92 80 86 Q86 92 96 86" fill={hair} />
      <path
        d="M58 92 Q64 112 80 116 Q96 112 102 92 Q94 102 80 104 Q66 102 58 92"
        fill={hair}
        stroke={INK}
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
    </>
  );
}

function HairBack({ who, hair }: { who: Who; hair: string }) {
  if (who === "papa") {
    return (
      <path
        d="M48 64 Q42 18 80 12 Q118 18 112 64 Q104 28 80 24 Q56 28 48 64"
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
        d="M40 78 Q30 128 48 142 Q80 112 112 142 Q130 128 120 72 Q114 22 80 16 Q46 22 40 78"
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
        d="M40 86 Q28 140 48 158 Q80 126 112 158 Q132 140 120 82 Q114 18 80 12 Q46 18 40 86"
        fill={hair}
        stroke={INK}
        strokeWidth={STROKE}
        strokeLinejoin="round"
      />
      <path
        d="M72 16 C78 -6 98 0 88 20"
        fill={hair}
        stroke={INK}
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
    </>
  );
}

function HairFront({ who, hair }: { who: Who; hair: string }) {
  if (who === "papa") {
    return (
      <path
        d="M48 58 Q80 38 112 58 Q102 48 80 48 Q58 48 48 58"
        fill={hair}
        stroke={INK}
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
    );
  }
  if (who === "child") {
    return (
      <path
        d="M46 66 Q64 44 82 58 Q106 40 118 70 Q100 52 76 60 Q56 52 46 66"
        fill={hair}
        stroke={INK}
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
    );
  }
  return (
    <path
      d="M48 64 Q62 42 80 52 Q98 40 112 64 Q100 50 80 56 Q60 52 48 64"
      fill={hair}
      stroke={INK}
      strokeWidth="3.2"
      strokeLinejoin="round"
    />
  );
}

function Clothes({ who, shirt }: { who: Who; shirt: string }) {
  if (who === "child") {
    return (
      <>
        <path
          d="M48 108 Q80 94 112 108 Q122 132 116 154 Q80 168 44 154 Q38 132 48 108"
          fill={shirt}
          stroke={INK}
          strokeWidth={STROKE}
          strokeLinejoin="round"
        />
        <Star x={66} y={124} />
        <Star x={92} y={120} />
        <Star x={78} y={140} />
        <Star x={104} y={136} />
        <path
          d="M46 148 H114 Q122 170 116 182 Q80 196 44 182 Q38 170 46 148"
          fill="#2456b8"
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
          d="M46 108 Q80 94 114 108 L120 154 Q80 166 40 154 Z"
          fill={shirt}
          stroke={INK}
          strokeWidth={STROKE}
          strokeLinejoin="round"
        />
        <path d="M80 112 L94 152 H66 Z" fill="#fff8ef" stroke={INK} strokeWidth="3" />
      </>
    );
  }

  return (
    <path
      d="M48 108 Q80 96 112 108 Q120 132 116 152 Q80 164 44 152 Q40 132 48 108"
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
      fill="#fff8ef"
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
    <g transform={`rotate(${angle} ${ox} 114)`}>
      <rect x={ox - 9} y={110} width={18} height={40} rx={9} fill={skin} stroke={INK} strokeWidth={STROKE} />
      <circle cx={ox} cy={152} r={11} fill={skin} stroke={INK} strokeWidth={STROKE} />
      <rect x={ox - 11} y={104} width={22} height={18} rx={8} fill={sleeve} stroke={INK} strokeWidth={STROKE} />
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
    <g transform={`rotate(${angle} ${ox} 156)`}>
      <rect
        x={ox - 10}
        y={148}
        width={20}
        height={length + 16}
        rx={10}
        fill={pants}
        stroke={INK}
        strokeWidth={STROKE}
      />
      <ellipse
        cx={ox + 2}
        cy={164 + length}
        rx={14}
        ry={8}
        fill={shoe}
        stroke={INK}
        strokeWidth={STROKE}
      />
    </g>
  );
}
