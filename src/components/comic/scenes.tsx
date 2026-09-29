import type { ReactNode } from "react";
import type { SceneId } from "@/lib/comic";

const INK = "#1c1917";

export function Scene({ id }: { id: SceneId }) {
  switch (id) {
    case "garden":
      return <Garden variant="base" />;
    case "garden-can":
      return <Garden variant="can" />;
    case "garden-path":
      return <Garden variant="path" />;
    case "garden-box":
      return <Garden variant="box" />;
    case "garden-crowns":
      return <Garden variant="crowns" />;
    case "garden-hug":
      return <Garden variant="hug" />;
    case "rain-room":
      return <LivingRoom variant="rain" />;
    case "fort":
      return <LivingRoom variant="fort" />;
    case "fort-inside":
      return <FortInside />;
    case "kitchen":
      return <Kitchen variant="cookies" />;
    case "towels":
      return <Kitchen variant="towels" />;
    case "bedroom":
      return <Bedroom variant="day" />;
    case "bedroom-sleep":
      return <Bedroom variant="sleep" />;
    case "band":
      return <Bedroom variant="band" />;
    case "concert":
    case "encore":
      return <Bedroom variant="concert" />;
    case "bow":
      return <Bedroom variant="bow" />;
    case "lights-down":
      return <Bedroom variant="night" />;
    case "doorway":
      return <Street variant="door" />;
    case "puddle":
      return <Street variant="splash" />;
    case "puddle-look":
      return <Street variant="look" />;
    case "puddle-leaf":
      return <Street variant="leaf" />;
    case "walk-home":
      return <Street variant="home" />;
    default: {
      const exhaustive: never = id;
      return exhaustive;
    }
  }
}

function Frame({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 640 420"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      {children}
    </svg>
  );
}

function Cloud({ x, y, fill = "#fff" }: { x: number; y: number; fill?: string }) {
  return (
    <g fill={fill} stroke={INK} strokeWidth="4">
      <ellipse cx={x} cy={y + 6} rx="28" ry="16" />
      <ellipse cx={x + 26} cy={y + 8} rx="22" ry="14" />
      <ellipse cx={x - 8} cy={y - 6} rx="20" ry="14" />
    </g>
  );
}

function LemonTree() {
  return (
    <g>
      <rect x="78" y="168" width="18" height="92" rx="6" fill="#8d5a3a" stroke={INK} strokeWidth="4" />
      <circle cx="62" cy="156" r="38" fill="#2d6a4f" stroke={INK} strokeWidth="4" />
      <circle cx="112" cy="148" r="42" fill="#40916c" stroke={INK} strokeWidth="4" />
      <circle cx="86" cy="118" r="30" fill="#52b788" stroke={INK} strokeWidth="4" />
      {[
        [70, 140],
        [104, 132],
        [84, 158],
        [118, 162],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="6" fill="#ffe066" stroke={INK} strokeWidth="3" />
      ))}
    </g>
  );
}

function Garden({ variant }: { variant: "base" | "can" | "path" | "box" | "crowns" | "hug" }) {
  const sunset = variant === "crowns" || variant === "hug";
  return (
    <Frame>
      <rect width="640" height="420" fill={sunset ? "#f4a261" : "#8ecae6"} />
      <circle cx={sunset ? 110 : 540} cy={sunset ? 250 : 68} r="36" fill="#ffd166" stroke={INK} strokeWidth="4" />
      {!sunset && <Cloud x={150} y={70} />}
      {!sunset && <Cloud x={360} y={48} />}
      {sunset && <Cloud x={420} y={80} fill="#ffd6a5" />}
      <path
        d="M0 230 Q180 180 340 220 T640 200 V420 H0 Z"
        fill={sunset ? "#ee8b6a" : "#b7e4c7"}
        stroke={INK}
        strokeWidth="4"
      />
      <path
        d="M0 300 Q220 250 420 300 T640 270 V420 H0 Z"
        fill={sunset ? "#d45d46" : "#74c69d"}
        stroke={INK}
        strokeWidth="4"
      />
      <LemonTree />
      {variant === "base" && <Map x={250} y={250} />}
      {variant === "can" && <WateringCan />}
      {variant === "path" && (
        <>
          <path
            d="M210 340 C260 300 300 360 360 310"
            fill="none"
            stroke="#f6edd6"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <path
            d="M210 340 C260 300 300 360 360 310"
            fill="none"
            stroke={INK}
            strokeWidth="4"
            strokeDasharray="10 12"
            strokeLinecap="round"
          />
        </>
      )}
      {variant === "box" && <Tin x={300} y={268} />}
      {(variant === "crowns" || variant === "hug") && (
        <>
          <Tin x={250} y={286} open />
          <Crown x={300} y={250} fill="#ffe08a" />
          <Crown x={360} y={262} fill="#fff" />
        </>
      )}
    </Frame>
  );
}

function Map({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(-8)`}>
      <rect x="0" y="0" width="86" height="64" rx="4" fill="#fff6df" stroke={INK} strokeWidth="4" />
      <path d="M14 46 C28 20 46 40 70 16" fill="none" stroke="#d62828" strokeWidth="3" />
      <circle cx="70" cy="16" r="4" fill="#d62828" />
      <circle cx="14" cy="46" r="3" fill="#1d3557" />
    </g>
  );
}

function WateringCan() {
  return (
    <g transform="translate(250 250)">
      <rect x="20" y="36" width="78" height="48" rx="10" fill="#d62828" stroke={INK} strokeWidth="4" />
      <path d="M98 50 H124 L118 78 H104" fill="none" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M28 36 Q36 8 58 14" fill="none" stroke={INK} strokeWidth="4" />
      <circle cx="124" cy="86" r="4" fill="#8ecae6" stroke={INK} strokeWidth="2" />
      <circle cx="136" cy="98" r="3.5" fill="#8ecae6" stroke={INK} strokeWidth="2" />
      <circle cx="118" cy="104" r="3" fill="#8ecae6" stroke={INK} strokeWidth="2" />
    </g>
  );
}

function Tin({ x, y, open = false }: { x: number; y: number; open?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="0" y="18" width="92" height="48" rx="6" fill="#d8d2c8" stroke={INK} strokeWidth="4" />
      <rect x="8" y="30" width="76" height="22" rx="3" fill="#f4e1b5" stroke={INK} strokeWidth="3" />
      {open ? (
        <rect x="6" y="-8" width="92" height="18" rx="4" fill="#eee" stroke={INK} strokeWidth="4" transform="rotate(-12 50 8)" />
      ) : (
        <rect x="0" y="8" width="92" height="16" rx="4" fill="#eee" stroke={INK} strokeWidth="4" />
      )}
    </g>
  );
}

function Crown({ x, y, fill }: { x: number; y: number; fill: string }) {
  return (
    <path
      d={`M${x} ${y + 28} L${x + 8} ${y + 8} L${x + 20} ${y + 22} L${x + 32} ${y} L${x + 44} ${y + 22} L${x + 56} ${y + 8} L${x + 64} ${y + 28} Z`}
      fill={fill}
      stroke={INK}
      strokeWidth="3"
      strokeLinejoin="round"
    />
  );
}

function Window({ x, y, night = false, rain = false }: { x: number; y: number; night?: boolean; rain?: boolean }) {
  const sky = night ? "#1d3557" : rain ? "#8d99ae" : "#8ecae6";
  return (
    <g>
      <rect x={x} y={y} width="120" height="90" rx="4" fill={sky} stroke={INK} strokeWidth="4" />
      <path d={`M${x + 60} ${y} V${y + 90} M${x} ${y + 45} H${x + 120}`} stroke={INK} strokeWidth="4" />
      {night && <circle cx={x + 86} cy={y + 24} r="8" fill="#ffe08a" stroke={INK} strokeWidth="2" />}
      {rain &&
        [0, 1, 2, 3, 4].map((drop) => (
          <path
            key={drop}
            d={`M${x + 18 + drop * 20} ${y + 16} l-6 14`}
            stroke="#edf6f9"
            strokeWidth="3"
            strokeLinecap="round"
          />
        ))}
    </g>
  );
}

function LivingRoom({ variant }: { variant: "rain" | "fort" }) {
  return (
    <Frame>
      <rect width="640" height="300" fill="#f7d6b8" />
      <rect y="300" width="640" height="120" fill="#e0a370" stroke={INK} strokeWidth="4" />
      <rect y="286" width="640" height="16" fill="#fff6df" stroke={INK} strokeWidth="4" />
      <Window x={40} y={36} rain />
      {variant === "fort" ? (
        <>
          <rect x="150" y="210" width="70" height="110" rx="6" fill="#6d597a" stroke={INK} strokeWidth="4" />
          <rect x="430" y="210" width="70" height="110" rx="6" fill="#6d597a" stroke={INK} strokeWidth="4" />
          <path
            d="M120 230 Q320 80 540 230 L520 300 H150 Z"
            fill="#1d3557"
            stroke={INK}
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <circle cx="250" cy="250" r="10" fill="#ffe08a" stroke={INK} strokeWidth="3" />
        </>
      ) : (
        <>
          <rect x="430" y="210" width="150" height="90" rx="8" fill="#f4a261" stroke={INK} strokeWidth="4" />
          <rect x="450" y="188" width="110" height="28" rx="8" fill="#e76f51" stroke={INK} strokeWidth="4" />
        </>
      )}
    </Frame>
  );
}

function FortInside() {
  return (
    <Frame>
      <rect width="640" height="420" fill="#1d3557" />
      <ellipse cx="320" cy="300" rx="250" ry="150" fill="#f6e7a8" opacity="0.95" />
      <ellipse cx="320" cy="310" rx="120" ry="70" fill="#fff6df" />
      <path d="M40 40 Q180 120 40 200" fill="none" stroke="#14213d" strokeWidth="28" />
      <path d="M600 30 Q470 130 610 220" fill="none" stroke="#14213d" strokeWidth="28" />
    </Frame>
  );
}

function Cookie({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r="14" fill="#c47b3a" stroke={INK} strokeWidth="3" />
      <circle cx={x - 4} cy={y - 2} r="2" fill="#6b3a22" />
      <circle cx={x + 4} cy={y + 3} r="2" fill="#6b3a22" />
    </g>
  );
}

function Kitchen({ variant }: { variant: "cookies" | "towels" }) {
  return (
    <Frame>
      <rect width="640" height="250" fill="#faedcd" />
      <rect y="250" width="640" height="170" fill="#e9c46a" stroke={INK} strokeWidth="4" />
      <rect x="40" y="40" width="180" height="70" rx="4" fill="#adc178" stroke={INK} strokeWidth="4" />
      <rect x="250" y="40" width="180" height="70" rx="4" fill="#adc178" stroke={INK} strokeWidth="4" />
      <Window x={470} y={28} />
      <rect x="150" y="230" width="280" height="18" rx="3" fill="#8d5a3a" stroke={INK} strokeWidth="4" />
      <rect x="190" y="248" width="16" height="80" fill="#8d5a3a" stroke={INK} strokeWidth="4" />
      <rect x="374" y="248" width="16" height="80" fill="#8d5a3a" stroke={INK} strokeWidth="4" />
      {variant === "cookies" ? (
        <>
          <ellipse cx="290" cy="214" rx="46" ry="14" fill="#fff" stroke={INK} strokeWidth="4" />
          <Cookie x={270} y={206} />
          <Cookie x={300} y={200} />
          <Cookie x={312} y={214} />
        </>
      ) : (
        <>
          <rect x="210" y="150" width="36" height="70" rx="6" fill="#8ecae6" stroke={INK} strokeWidth="4" />
          <rect x="330" y="146" width="36" height="74" rx="6" fill="#f4a261" stroke={INK} strokeWidth="4" />
          <rect x="250" y="188" width="28" height="34" rx="4" fill="#6d4c41" stroke={INK} strokeWidth="3" />
          <path d="M264 176 q8 -16 8 0" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          <rect x="300" y="184" width="28" height="34" rx="4" fill="#fff6df" stroke={INK} strokeWidth="3" />
        </>
      )}
    </Frame>
  );
}

function Animal({ x, y, kind }: { x: number; y: number; kind: "bear" | "bunny" | "star" }) {
  if (kind === "star") {
    return (
      <path
        d={`M${x} ${y} l6 12 h12 l-10 8 4 12 -12 -8 -12 8 4 -12 -10 -8 h12 z`}
        fill="#ffe08a"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
    );
  }
  const color = kind === "bear" ? "#c47b3a" : "#f6efe4";
  return (
    <g>
      <circle cx={x - 10} cy={y - 8} r="7" fill={color} stroke={INK} strokeWidth="3" />
      <circle cx={x + 10} cy={y - 8} r="7" fill={color} stroke={INK} strokeWidth="3" />
      <circle cx={x} cy={y + 6} r="14" fill={color} stroke={INK} strokeWidth="3" />
      {kind === "bunny" && (
        <>
          <ellipse cx={x - 8} cy={y - 24} rx="4" ry="10" fill={color} stroke={INK} strokeWidth="3" />
          <ellipse cx={x + 8} cy={y - 24} rx="4" ry="10" fill={color} stroke={INK} strokeWidth="3" />
        </>
      )}
    </g>
  );
}

function StitchPlush({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <ellipse cx={x - 16} cy={y - 4} rx="7" ry="12" fill="#3a7de8" stroke={INK} strokeWidth="3" />
      <ellipse cx={x + 16} cy={y - 4} rx="7" ry="12" fill="#3a7de8" stroke={INK} strokeWidth="3" />
      <circle cx={x} cy={y + 6} r="15" fill="#4c94f5" stroke={INK} strokeWidth="3" />
      <ellipse cx={x - 5} cy={y + 4} rx="3.2" ry="4.2" fill={INK} />
      <ellipse cx={x + 6} cy={y + 4} rx="3.2" ry="4.2" fill={INK} />
      <ellipse cx={x} cy={y + 12} rx="4" ry="2.4" fill="#1d3557" />
    </g>
  );
}

function Pot({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M0 20 H48 L40 58 H8 Z" fill="#d8d2c8" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <rect x="-4" y="10" width="56" height="12" rx="3" fill="#eee" stroke={INK} strokeWidth="4" />
    </g>
  );
}

function Bedroom({ variant }: { variant: "day" | "sleep" | "band" | "concert" | "bow" | "night" }) {
  const night = variant === "night" || variant === "sleep";
  return (
    <Frame>
      <rect width="640" height="300" fill={night ? "#2b2d42" : "#fde2e4"} />
      <rect y="300" width="640" height="120" fill={night ? "#3d405b" : "#f6bd60"} stroke={INK} strokeWidth="4" />
      <Window x={460} y={36} night={night} />
      <rect x="70" y="210" width="230" height="110" rx="10" fill={night ? "#1d3557" : "#8ecae6"} stroke={INK} strokeWidth="4" />
      <rect x="70" y="196" width="230" height="28" rx="8" fill="#fff" stroke={INK} strokeWidth="4" />
      <rect x="250" y="230" width="36" height="24" rx="6" fill="#ffe08a" stroke={INK} strokeWidth="3" />
      {(variant === "band" || variant === "bow" || variant === "day") && (
        <>
          <Animal x={120} y={176} kind="bear" />
          <StitchPlush x={168} y={170} />
          <Animal x={214} y={168} kind="star" />
        </>
      )}
      {(variant === "concert" || variant === "bow") && (
        <>
          <Pot x={250} y={300} />
          <Pot x={330} y={314} scale={0.8} />
          <rect x="400" y="330" width="70" height="16" rx="4" fill="#e07a5f" stroke={INK} strokeWidth="3" />
        </>
      )}
      {variant === "night" && (
        <g>
          <rect x="300" y="70" width="18" height="70" fill="#6b3a22" stroke={INK} strokeWidth="3" />
          <path d="M250 78 H370 L309 150 Z" fill="#ffe08a" stroke={INK} strokeWidth="4" opacity="0.35" />
        </g>
      )}
      {variant !== "night" && (
        <g>
          <rect x="300" y="78" width="16" height="64" fill="#6b3a22" stroke={INK} strokeWidth="3" />
          <path d="M246 86 H372 L308 20 Z" fill="#ffe08a" stroke={INK} strokeWidth="4" />
        </g>
      )}
    </Frame>
  );
}

function Street({ variant }: { variant: "door" | "splash" | "look" | "leaf" | "home" }) {
  return (
    <Frame>
      <rect width="640" height="420" fill={variant === "home" ? "#f4a261" : "#bde0fe"} />
      {variant !== "home" && <Cloud x={80} y={54} />}
      <circle cx="540" cy="64" r="28" fill="#ffd166" stroke={INK} strokeWidth="4" />
      {variant === "door" && (
        <>
          <rect width="200" height="270" fill="#faedcd" />
          <rect x="150" y="70" width="120" height="200" rx="4" fill="#8d99ae" stroke={INK} strokeWidth="5" />
          <circle cx="250" cy="170" r="5" fill="#ffd166" stroke={INK} strokeWidth="2" />
        </>
      )}
      <path d="M0 250 H640 V420 H0 Z" fill="#8d99ae" stroke={INK} strokeWidth="4" />
      <path d="M0 310 H640 V420 H0 Z" fill="#6c757d" />
      {variant === "door" && (
        <ellipse cx="470" cy="360" rx="110" ry="26" fill="#8ecae6" stroke={INK} strokeWidth="4" />
      )}
      {(variant === "splash" || variant === "look" || variant === "leaf") && (
        <ellipse cx="340" cy="350" rx="170" ry="42" fill="#8ecae6" stroke={INK} strokeWidth="4" />
      )}
      {variant === "look" && (
        <>
          <ellipse cx="300" cy="348" rx="16" ry="8" fill="#fff" opacity="0.7" />
          <ellipse cx="370" cy="356" rx="22" ry="8" fill="#fff" opacity="0.55" />
        </>
      )}
      {variant === "leaf" && (
        <ellipse cx="360" cy="338" rx="22" ry="10" fill="#52b788" stroke={INK} strokeWidth="3" transform="rotate(-18 360 338)" />
      )}
      {variant === "splash" && (
        <>
          <circle cx="250" cy="300" r="6" fill="#8ecae6" stroke={INK} strokeWidth="2" />
          <circle cx="280" cy="286" r="4" fill="#8ecae6" stroke={INK} strokeWidth="2" />
          <circle cx="230" cy="284" r="3.5" fill="#8ecae6" stroke={INK} strokeWidth="2" />
        </>
      )}
      {variant === "home" && (
        <>
          <rect x="80" y="150" width="90" height="100" fill="#f6bd60" stroke={INK} strokeWidth="4" />
          <path d="M70 150 H180 L125 110 Z" fill="#d62828" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          <rect x="430" y="140" width="110" height="110" fill="#f4a261" stroke={INK} strokeWidth="4" />
          <path d="M418 140 H552 L485 96 Z" fill="#1d3557" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          <ellipse cx="180" cy="360" rx="40" ry="12" fill="#8ecae6" stroke={INK} strokeWidth="3" />
          <ellipse cx="460" cy="372" rx="28" ry="8" fill="#8ecae6" stroke={INK} strokeWidth="3" />
        </>
      )}
    </Frame>
  );
}
