import { useId, type ReactNode } from "react";
import type { SceneId } from "@/lib/comic";

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
    case "mirror-spain":
      return <MagicMirror variant="spain" />;
    case "mirror-glow":
      return <MagicMirror variant="glow" />;
    case "mirror-cross":
      return <MagicMirror variant="cross" />;
    case "mirror-brazil":
      return <MagicMirror variant="brazil" />;
    case "mirror-bye":
      return <MagicMirror variant="bye" />;
    default: {
      const exhaustive: never = id;
      return exhaustive;
    }
  }
}

function Frame({ children }: { children: ReactNode }) {
  const raw = useId().replace(/:/g, "");
  const wash = `wash-${raw}`;
  const grain = `grain-${raw}`;
  return (
    <svg
      viewBox="0 0 640 420"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <filter id={wash} x="-8%" y="-8%" width="116%" height="116%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.02"
            numOctaves="3"
            seed="4"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="14"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="0.55" />
        </filter>
        <filter id={grain} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.15  0 0 0 0 0.32  0 0 0 0 0.55  0 0 0 0.22 0"
          />
        </filter>
      </defs>
      <g filter={`url(#${wash})`}>{children}</g>
      <rect width="640" height="420" filter={`url(#${grain})`} opacity="0.45" style={{ mixBlendMode: "multiply" }} />
    </svg>
  );
}

function Cloud({ x, y, fill = "#fff" }: { x: number; y: number; fill?: string }) {
  return (
    <g fill={fill} stroke="none" strokeWidth="4">
      <ellipse cx={x} cy={y + 6} rx="28" ry="16" />
      <ellipse cx={x + 26} cy={y + 8} rx="22" ry="14" />
      <ellipse cx={x - 8} cy={y - 6} rx="20" ry="14" />
    </g>
  );
}

function LemonTree() {
  return (
    <g>
      <rect x="78" y="168" width="18" height="92" rx="6" fill="#8d5a3a" stroke="none" strokeWidth="4" />
      <circle cx="62" cy="156" r="38" fill="#2d6a4f" stroke="none" strokeWidth="4" />
      <circle cx="112" cy="148" r="42" fill="#40916c" stroke="none" strokeWidth="4" />
      <circle cx="86" cy="118" r="30" fill="#52b788" stroke="none" strokeWidth="4" />
      {[
        [70, 140],
        [104, 132],
        [84, 158],
        [118, 162],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="6" fill="#ffe066" stroke="none" strokeWidth="3" />
      ))}
    </g>
  );
}

function Garden({ variant }: { variant: "base" | "can" | "path" | "box" | "crowns" | "hug" }) {
  const sunset = variant === "crowns" || variant === "hug";
  return (
    <Frame>
      <rect width="640" height="420" fill={sunset ? "#f4a261" : "#8ecae6"} />
      <circle cx={sunset ? 110 : 540} cy={sunset ? 250 : 68} r="36" fill="#ffd166" stroke="none" strokeWidth="4" />
      {!sunset && <Cloud x={150} y={70} />}
      {!sunset && <Cloud x={360} y={48} />}
      {sunset && <Cloud x={420} y={80} fill="#ffd6a5" />}
      <path
        d="M0 230 Q180 180 340 220 T640 200 V420 H0 Z"
        fill={sunset ? "#ee8b6a" : "#b7e4c7"}
        stroke="none"
        strokeWidth="4"
      />
      <path
        d="M0 300 Q220 250 420 300 T640 270 V420 H0 Z"
        fill={sunset ? "#d45d46" : "#74c69d"}
        stroke="none"
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
            stroke="none"
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
      <rect x="0" y="0" width="86" height="64" rx="4" fill="#fff6df" stroke="none" strokeWidth="4" />
      <path d="M14 46 C28 20 46 40 70 16" fill="none" stroke="#d62828" strokeWidth="3" />
      <circle cx="70" cy="16" r="4" fill="#d62828" />
      <circle cx="14" cy="46" r="3" fill="#1d3557" />
    </g>
  );
}

function WateringCan() {
  return (
    <g transform="translate(250 250)">
      <rect x="20" y="36" width="78" height="48" rx="10" fill="#d62828" stroke="none" strokeWidth="4" />
      <path d="M98 50 H124 L118 78 H104" fill="none" stroke="#9b2331" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M28 36 Q36 8 58 14" fill="none" stroke="#9b2331" strokeWidth="5" strokeLinecap="round" />
      <circle cx="124" cy="86" r="4" fill="#8ecae6" stroke="none" strokeWidth="2" />
      <circle cx="136" cy="98" r="3.5" fill="#8ecae6" stroke="none" strokeWidth="2" />
      <circle cx="118" cy="104" r="3" fill="#8ecae6" stroke="none" strokeWidth="2" />
    </g>
  );
}

function Tin({ x, y, open = false }: { x: number; y: number; open?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="0" y="18" width="92" height="48" rx="6" fill="#d8d2c8" stroke="none" strokeWidth="4" />
      <rect x="8" y="30" width="76" height="22" rx="3" fill="#f4e1b5" stroke="none" strokeWidth="3" />
      {open ? (
        <rect x="6" y="-8" width="92" height="18" rx="4" fill="#eee" stroke="none" strokeWidth="4" transform="rotate(-12 50 8)" />
      ) : (
        <rect x="0" y="8" width="92" height="16" rx="4" fill="#eee" stroke="none" strokeWidth="4" />
      )}
    </g>
  );
}

function Crown({ x, y, fill }: { x: number; y: number; fill: string }) {
  return (
    <path
      d={`M${x} ${y + 28} L${x + 8} ${y + 8} L${x + 20} ${y + 22} L${x + 32} ${y} L${x + 44} ${y + 22} L${x + 56} ${y + 8} L${x + 64} ${y + 28} Z`}
      fill={fill}
      stroke="none"
      strokeWidth="3"
      strokeLinejoin="round"
    />
  );
}

function Window({ x, y, night = false, rain = false }: { x: number; y: number; night?: boolean; rain?: boolean }) {
  const sky = night ? "#1d3557" : rain ? "#8d99ae" : "#8ecae6";
  return (
    <g>
      <rect x={x} y={y} width="120" height="90" rx="4" fill={sky} stroke="none" strokeWidth="4" />
      <path d={`M${x + 60} ${y} V${y + 90} M${x} ${y + 45} H${x + 120}`} stroke="#f4fbff" strokeWidth="5" strokeLinecap="round" />
      {night && <circle cx={x + 86} cy={y + 24} r="8" fill="#ffe08a" stroke="none" strokeWidth="2" />}
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
      <rect y="300" width="640" height="120" fill="#e0a370" stroke="none" strokeWidth="4" />
      <rect y="286" width="640" height="16" fill="#fff6df" stroke="none" strokeWidth="4" />
      <Window x={40} y={36} rain />
      {variant === "fort" ? (
        <>
          <rect x="150" y="210" width="70" height="110" rx="6" fill="#6d597a" stroke="none" strokeWidth="4" />
          <rect x="430" y="210" width="70" height="110" rx="6" fill="#6d597a" stroke="none" strokeWidth="4" />
          <path
            d="M120 230 Q320 80 540 230 L520 300 H150 Z"
            fill="#1d3557"
            stroke="none"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <circle cx="250" cy="250" r="10" fill="#ffe08a" stroke="none" strokeWidth="3" />
        </>
      ) : (
        <>
          <rect x="430" y="210" width="150" height="90" rx="8" fill="#f4a261" stroke="none" strokeWidth="4" />
          <rect x="450" y="188" width="110" height="28" rx="8" fill="#e76f51" stroke="none" strokeWidth="4" />
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
      <circle cx={x} cy={y} r="14" fill="#c47b3a" stroke="none" strokeWidth="3" />
      <circle cx={x - 4} cy={y - 2} r="2" fill="#6b3a22" />
      <circle cx={x + 4} cy={y + 3} r="2" fill="#6b3a22" />
    </g>
  );
}

function Kitchen({ variant }: { variant: "cookies" | "towels" }) {
  return (
    <Frame>
      <rect width="640" height="250" fill="#faedcd" />
      <rect y="250" width="640" height="170" fill="#e9c46a" stroke="none" strokeWidth="4" />
      <rect x="40" y="40" width="180" height="70" rx="4" fill="#adc178" stroke="none" strokeWidth="4" />
      <rect x="250" y="40" width="180" height="70" rx="4" fill="#adc178" stroke="none" strokeWidth="4" />
      <Window x={470} y={28} />
      <rect x="150" y="230" width="280" height="18" rx="3" fill="#8d5a3a" stroke="none" strokeWidth="4" />
      <rect x="190" y="248" width="16" height="80" fill="#8d5a3a" stroke="none" strokeWidth="4" />
      <rect x="374" y="248" width="16" height="80" fill="#8d5a3a" stroke="none" strokeWidth="4" />
      {variant === "cookies" ? (
        <>
          <ellipse cx="290" cy="214" rx="46" ry="14" fill="#fff" stroke="none" strokeWidth="4" />
          <Cookie x={270} y={206} />
          <Cookie x={300} y={200} />
          <Cookie x={312} y={214} />
        </>
      ) : (
        <>
          <rect x="210" y="150" width="36" height="70" rx="6" fill="#8ecae6" stroke="none" strokeWidth="4" />
          <rect x="330" y="146" width="36" height="74" rx="6" fill="#f4a261" stroke="none" strokeWidth="4" />
          <rect x="250" y="188" width="28" height="34" rx="4" fill="#6d4c41" stroke="none" strokeWidth="3" />
          <path d="M264 176 q8 -16 8 0" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          <rect x="300" y="184" width="28" height="34" rx="4" fill="#fff6df" stroke="none" strokeWidth="3" />
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
        stroke="none"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    );
  }
  const color = kind === "bear" ? "#c47b3a" : "#f6efe4";
  return (
    <g>
      <circle cx={x - 10} cy={y - 8} r="7" fill={color} stroke="none" strokeWidth="3" />
      <circle cx={x + 10} cy={y - 8} r="7" fill={color} stroke="none" strokeWidth="3" />
      <circle cx={x} cy={y + 6} r="14" fill={color} stroke="none" strokeWidth="3" />
      {kind === "bunny" && (
        <>
          <ellipse cx={x - 8} cy={y - 24} rx="4" ry="10" fill={color} stroke="none" strokeWidth="3" />
          <ellipse cx={x + 8} cy={y - 24} rx="4" ry="10" fill={color} stroke="none" strokeWidth="3" />
        </>
      )}
    </g>
  );
}

function NiloPlush({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx="-11" cy="-16" rx="7" ry="6" fill="#8d5a3a" />
      <ellipse cx="11" cy="-16" rx="7" ry="6" fill="#8d5a3a" />
      <ellipse cx="-11" cy="-16" rx="3.5" ry="3" fill="#f6ead4" />
      <ellipse cx="11" cy="-16" rx="3.5" ry="3" fill="#f6ead4" />
      <ellipse cx="0" cy="2" rx="16" ry="15" fill="#e8b086" />
      <path d="M-14 -6 Q0 -18 14 -6 Q8 2 0 1 Q-8 2 -14 -6" fill="#8d5a3a" />
      <ellipse cx="0" cy="8" rx="8" ry="7" fill="#fff6ea" />
      <path d="M-2 4 L0 7 L2 4 L0 5 Z" fill="#e6b325" />
      <ellipse cx="-6" cy="-1" rx="3.2" ry="3.6" fill="#f4e1c4" />
      <ellipse cx="6" cy="-1" rx="3.2" ry="3.6" fill="#f4e1c4" />
      <circle cx="-6" cy="-1" r="1.7" fill="#c47b1a" />
      <circle cx="6" cy="-1" r="1.7" fill="#c47b1a" />
      <circle cx="0" cy="4" r="1.6" fill="#6b3a22" />
      <path d="M18 8 Q34 2 40 14 Q30 16 22 14" fill="#e8b086" />
      <path d="M28 6 Q36 8 38 14" fill="none" stroke="#8d5a3a" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

function Pot({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M0 20 H48 L40 58 H8 Z" fill="#d8d2c8" stroke="none" strokeWidth="4" strokeLinejoin="round" />
      <rect x="-4" y="10" width="56" height="12" rx="3" fill="#eee" stroke="none" strokeWidth="4" />
    </g>
  );
}

function Bedroom({ variant }: { variant: "day" | "sleep" | "band" | "concert" | "bow" | "night" }) {
  const night = variant === "night" || variant === "sleep";
  return (
    <Frame>
      <rect width="640" height="300" fill={night ? "#2b2d42" : "#fde2e4"} />
      <rect y="300" width="640" height="120" fill={night ? "#3d405b" : "#f6bd60"} stroke="none" strokeWidth="4" />
      <Window x={460} y={36} night={night} />
      <rect x="70" y="210" width="230" height="110" rx="10" fill={night ? "#1d3557" : "#8ecae6"} stroke="none" strokeWidth="4" />
      <rect x="70" y="196" width="230" height="28" rx="8" fill="#fff" stroke="none" strokeWidth="4" />
      <rect x="250" y="230" width="36" height="24" rx="6" fill="#ffe08a" stroke="none" strokeWidth="3" />
      {(variant === "band" || variant === "bow" || variant === "day") && (
        <>
          <Animal x={120} y={176} kind="bear" />
          <NiloPlush x={168} y={170} />
          <Animal x={214} y={168} kind="star" />
        </>
      )}
      {(variant === "concert" || variant === "bow") && (
        <>
          <Pot x={250} y={300} />
          <Pot x={330} y={314} scale={0.8} />
          <rect x="400" y="330" width="70" height="16" rx="4" fill="#e07a5f" stroke="none" strokeWidth="3" />
        </>
      )}
      {variant === "night" && (
        <g>
          <rect x="300" y="70" width="18" height="70" fill="#6b3a22" stroke="none" strokeWidth="3" />
          <path d="M250 78 H370 L309 150 Z" fill="#ffe08a" stroke="none" strokeWidth="4" opacity="0.35" />
        </g>
      )}
      {variant !== "night" && (
        <g>
          <rect x="300" y="78" width="16" height="64" fill="#6b3a22" stroke="none" strokeWidth="3" />
          <path d="M246 86 H372 L308 20 Z" fill="#ffe08a" stroke="none" strokeWidth="4" />
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
      <circle cx="540" cy="64" r="28" fill="#ffd166" stroke="none" strokeWidth="4" />
      {variant === "door" && (
        <>
          <rect width="200" height="270" fill="#faedcd" />
          <rect x="150" y="70" width="120" height="200" rx="4" fill="#8d99ae" stroke="none" strokeWidth="5" />
          <circle cx="250" cy="170" r="5" fill="#ffd166" stroke="none" strokeWidth="2" />
        </>
      )}
      <path d="M0 250 H640 V420 H0 Z" fill="#8d99ae" stroke="none" strokeWidth="4" />
      <path d="M0 310 H640 V420 H0 Z" fill="#6c757d" />
      {variant === "door" && (
        <ellipse cx="470" cy="360" rx="110" ry="26" fill="#8ecae6" stroke="none" strokeWidth="4" />
      )}
      {(variant === "splash" || variant === "look" || variant === "leaf") && (
        <ellipse cx="340" cy="350" rx="170" ry="42" fill="#8ecae6" stroke="none" strokeWidth="4" />
      )}
      {variant === "look" && (
        <>
          <ellipse cx="300" cy="348" rx="16" ry="8" fill="#fff" opacity="0.7" />
          <ellipse cx="370" cy="356" rx="22" ry="8" fill="#fff" opacity="0.55" />
        </>
      )}
      {variant === "leaf" && (
        <ellipse cx="360" cy="338" rx="22" ry="10" fill="#52b788" stroke="none" strokeWidth="3" transform="rotate(-18 360 338)" />
      )}
      {variant === "splash" && (
        <>
          <circle cx="250" cy="300" r="6" fill="#8ecae6" stroke="none" strokeWidth="2" />
          <circle cx="280" cy="286" r="4" fill="#8ecae6" stroke="none" strokeWidth="2" />
          <circle cx="230" cy="284" r="3.5" fill="#8ecae6" stroke="none" strokeWidth="2" />
        </>
      )}
      {variant === "home" && (
        <>
          <rect x="80" y="150" width="90" height="100" fill="#f6bd60" stroke="none" strokeWidth="4" />
          <path d="M70 150 H180 L125 110 Z" fill="#d62828" stroke="none" strokeWidth="4" strokeLinejoin="round" />
          <rect x="430" y="140" width="110" height="110" fill="#f4a261" stroke="none" strokeWidth="4" />
          <path d="M418 140 H552 L485 96 Z" fill="#1d3557" stroke="none" strokeWidth="4" strokeLinejoin="round" />
          <ellipse cx="180" cy="360" rx="40" ry="12" fill="#8ecae6" stroke="none" strokeWidth="3" />
          <ellipse cx="460" cy="372" rx="28" ry="8" fill="#8ecae6" stroke="none" strokeWidth="3" />
        </>
      )}
    </Frame>
  );
}

function MagicMirror({ variant }: { variant: "spain" | "glow" | "cross" | "brazil" | "bye" }) {
  if (variant === "cross") return <MirrorCrossing />;
  if (variant === "brazil") return <BrazilRoom />;
  const glow = variant === "glow" || variant === "bye";
  return (
    <Frame>
      <SpainSide />
      <BrazilSide />
      <path d="M0 300 H640 V420 H0 Z" fill="#e7c39a" stroke="none" strokeWidth="4" />
      <MirrorFrame glow={glow} />
      {variant === "bye" && (
        <path
          d="M250 250 H390"
          stroke="#fff6df"
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.8"
        />
      )}
    </Frame>
  );
}

function SpainSide() {
  return (
    <g>
      <rect width="320" height="300" fill="#f6e4c8" />
      <ellipse cx="70" cy="40" rx="170" ry="110" fill="#ffe7a8" opacity="0.9" />
      <ellipse cx="220" cy="160" rx="130" ry="90" fill="#f3d2a4" opacity="0.65" />
      <rect x="28" y="36" width="110" height="90" rx="4" fill="#8ecae6" stroke="none" strokeWidth="4" />
      <path d="M83 36 V126 M28 80 H138" stroke="#f4fbff" strokeWidth="5" strokeLinecap="round" />
      <circle cx="96" cy="58" r="10" fill="#ffd166" stroke="none" strokeWidth="2" />
      <rect x="36" y="150" width="70" height="46" rx="4" fill="#d62828" stroke="none" strokeWidth="3" />
      <path d="M28 150 H114 L71 128 Z" fill="#9b2331" stroke="none" strokeWidth="3" strokeLinejoin="round" />
    </g>
  );
}

function BrazilSide() {
  const beads = ["#e23d3d", "#f4a261", "#ffe08a", "#52b788", "#4ea2ff", "#9b5de5"];
  return (
    <g>
      <rect x="320" width="320" height="300" fill="#e5f7ea" />
      <ellipse cx="520" cy="70" rx="160" ry="110" fill="#b7ebc8" opacity="0.85" />
      <ellipse cx="400" cy="190" rx="120" ry="80" fill="#ffd0de" opacity="0.55" />
      <Hibiscus x={560} y={150} />
      <rect x="470" y="40" width="120" height="86" rx="4" fill="#c8f0d4" stroke="none" strokeWidth="4" />
      <circle cx="530" cy="78" r="22" fill="#52b788" stroke="none" strokeWidth="3" />
      <rect x="524" y="96" width="12" height="22" fill="#8d5a3a" stroke="none" strokeWidth="2" />
      {beads.map((color, index) => (
        <circle
          key={color}
          cx={360 + index * 16}
          cy={28 + (index % 2) * 6}
          r="5"
          fill={color}
          stroke="none"
          strokeWidth="2"
        />
      ))}
      <NiloPlush x={520} y={128} scale={1.2} />
    </g>
  );
}

function MirrorFrame({ glow }: { glow: boolean }) {
  return (
    <g>
      <rect
        x="268"
        y="28"
        width="104"
        height="280"
        rx="8"
        fill={glow ? "#fff3b0" : "#d7f4ff"}
        stroke="#e6b325"
        strokeWidth="12"
      />
      <rect
        x="268"
        y="28"
        width="104"
        height="280"
        rx="8"
        fill="none"
        stroke="none"
        strokeWidth="4"
      />
      {glow && (
        <>
          <circle cx="300" cy="90" r="6" fill="#fff" stroke="none" strokeWidth="2" />
          <circle cx="340" cy="140" r="4" fill="#fff" stroke="none" strokeWidth="2" />
          <circle cx="318" cy="190" r="5" fill="#fff6df" stroke="none" strokeWidth="2" />
        </>
      )}
    </g>
  );
}

function Hibiscus({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 72, 144, 216, 288].map((angle) => (
        <ellipse
          key={angle}
          cx="0"
          cy="-12"
          rx="6"
          ry="11"
          fill="#ef4b7a"
          transform={`rotate(${angle})`}
        />
      ))}
      <circle r="4.5" fill="#ffe56b" />
    </g>
  );
}

function BrazilRoom() {
  const beads = ["#ef4b7a", "#f4a261", "#ffe56b", "#3dbe86", "#3d86f6", "#7a5af5"];
  return (
    <Frame>
      <rect width="640" height="300" fill="#e7f8ee" />
      <ellipse cx="120" cy="80" rx="180" ry="120" fill="#c9f3d4" />
      <ellipse cx="480" cy="40" rx="200" ry="90" fill="#d7f1ff" opacity="0.8" />
      <Hibiscus x={250} y={120} />
      <Hibiscus x={400} y={70} />
      <rect y="300" width="640" height="120" fill="#f0d2a8" stroke="none" strokeWidth="4" />
      <rect x="36" y="28" width="150" height="100" rx="4" fill="#b7e4c7" stroke="none" strokeWidth="4" />
      <circle cx="110" cy="74" r="28" fill="#52b788" stroke="none" strokeWidth="3" />
      <rect x="102" y="98" width="16" height="24" fill="#8d5a3a" stroke="none" strokeWidth="3" />
      {beads.map((color, index) => (
        <circle
          key={color}
          cx={220 + index * 18}
          cy={36 + (index % 2) * 7}
          r="6"
          fill={color}
          stroke="none"
          strokeWidth="2"
        />
      ))}
      <NiloPlush x={530} y={158} scale={1.7} />
      <MirrorFrame glow />
    </Frame>
  );
}

function MirrorCrossing() {
  return (
    <Frame>
      <rect width="640" height="420" fill="#1d3557" />
      <circle cx="90" cy="70" r="3" fill="#fff6df" />
      <circle cx="180" cy="120" r="2" fill="#fff" />
      <circle cx="520" cy="80" r="3" fill="#ffe08a" />
      <circle cx="460" cy="150" r="2" fill="#fff" />
      <circle cx="300" cy="60" r="2.5" fill="#fff6df" />
      <ellipse cx="320" cy="250" rx="210" ry="150" fill="#fff3b0" opacity="0.9" />
      <ellipse cx="320" cy="250" rx="120" ry="86" fill="#fffdf6" />
      <rect x="250" y="40" width="140" height="340" rx="10" fill="none" stroke="#e6b325" strokeWidth="12" />
      <rect x="250" y="40" width="140" height="340" rx="10" fill="none" stroke="none" strokeWidth="4" />
    </Frame>
  );
}
