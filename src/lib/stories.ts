import type { Actor, Story } from "@/lib/comic";

const pair = (
  child: Actor["pose"],
  parent: Actor["pose"],
  layout: "talk" | "close" = "talk",
): Actor[] => {
  if (layout === "close") {
    return [
      { who: "child", pose: child, x: "16%" },
      { who: "parent", pose: parent, flip: true, x: "44%" },
    ];
  }
  return [
    { who: "child", pose: child, x: "6%" },
    { who: "parent", pose: parent, flip: true, x: "50%" },
  ];
};

const apart = (child: Actor["pose"], parent: Actor["pose"]): Actor[] => [
  { who: "parent", pose: parent, x: "3%" },
  { who: "child", pose: child, flip: true, x: "54%" },
];

export const STORIES: Story[] = [
  {
    id: "espejo",
    title: "El espejo entre España y Brasil",
    blurb:
      "Aynara vive en Brasil y Nicolas en España. Un espejo mágico abre el camino para verse.",
    cover: "mirror-glow",
    coverArt: "/art/scene-cover.jpg",
    pages: [
      {
        id: "esp-1",
        panels: [
          {
            id: "esp-1a",
            scene: "mirror-spain",
            art: "/art/scene-1a.png",
            caption: "Aynara vive en Brasil. Nicolas, en España.",
            bubbles: [
              {
                id: "esp-1a-c",
                speaker: "child",
                text: "Papá, el espejo de mi cuarto está tibio.",
              },
              {
                id: "esp-1a-p",
                speaker: "parent",
                text: "El mío también. Creo que se están buscando.",
              },
            ],
            actors: apart("wave", "peek"),
          },
          {
            id: "esp-1b",
            scene: "mirror-glow",
            art: "/art/scene-1b.jpg",
            sfx: "¡brilla!",
            bubbles: [
              {
                id: "esp-1b-c",
                speaker: "child",
                text: "Si lo miramos a la vez, se abre.",
              },
              {
                id: "esp-1b-p",
                speaker: "parent",
                text: "Entonces miro. Y cruzo.",
              },
            ],
            actors: apart("point", "point"),
          },
        ],
      },
      {
        id: "esp-2",
        panels: [
          {
            id: "esp-2a",
            scene: "mirror-cross",
            art: "/art/scene-2a.jpg",
            caption: "Nicolas dio un paso, y España se quedó atrás.",
            bubbles: [
              {
                id: "esp-2a-c",
                speaker: "child",
                text: "¡Te veo dentro del marco!",
              },
              {
                id: "esp-2a-p",
                speaker: "parent",
                text: "El camino es corto. Ya huelo tu cuarto.",
              },
            ],
            actors: pair("cheer", "wave", "close"),
          },
          {
            id: "esp-2b",
            scene: "mirror-brazil",
            art: "/art/scene-2b.jpg",
            caption: "Del otro lado estaba Brasil.",
            bubbles: [
              {
                id: "esp-2b-c",
                speaker: "child",
                text: "¡Llegaste! ¡Stitch y yo estábamos esperándote con los brazos abiertos!",
              },
              {
                id: "esp-2b-p",
                speaker: "parent",
                text: "Un parpadeo, y ya estoy aquí con los dos.",
              },
            ],
            actors: pair("cheer", "wave"),
          },
        ],
      },
      {
        id: "esp-3",
        panels: [
          {
            id: "esp-3a",
            scene: "mirror-brazil",
            art: "/art/scene-3a.jpg",
            bubbles: [
              {
                id: "esp-3a-c",
                speaker: "child",
                text: "Stitch come galletas y no quiere que te vayas nunca.",
              },
              {
                id: "esp-3a-p",
                speaker: "parent",
                text: "El espejo mágico siempre nos reunirá cuando lo miremos.",
              },
            ],
            actors: pair("peek", "stand"),
          },
          {
            id: "esp-3b",
            scene: "mirror-bye",
            art: "/art/scene-3b.jpg",
            caption: "El marco guardó el camino entre los dos países.",
            bubbles: [
              {
                id: "esp-3b-c",
                speaker: "child",
                text: "¡Abrazo gigante! Te quiero con todo mi corazón, papá.",
              },
              {
                id: "esp-3b-p",
                speaker: "parent",
                text: "Y yo a ti, Aynara. Brasil y España quedan a un solo paso.",
              },
            ],
            actors: apart("hug", "hug"),
          },
        ],
      },
    ],
  },
  {
    id: "limonero",
    title: "El mapa del limonero",
    blurb:
      "Un mapa con crayón los lleva hasta un tesoro que cabe en una caja de galletas.",
    cover: "garden",
    coverArt: "/art/scene-lim-cover.jpg",
    pages: [
      {
        id: "lim-1",
        panels: [
          {
            id: "lim-1a",
            scene: "garden",
            art: "/art/scene-lim-1a.png",
            caption: "Un sábado, detrás del limonero.",
            bubbles: [
              {
                id: "lim-1a-c",
                speaker: "child",
                text: "Mira, {{parent}}. Un mapa dibujado con crayón.",
              },
              {
                id: "lim-1a-p",
                speaker: "parent",
                text: "Tiene manchas de limón. Alguien lo dejó para nosotros.",
              },
            ],
            actors: pair("kneel", "point"),
          },
          {
            id: "lim-1b",
            scene: "garden-can",
            art: "/art/scene-lim-1b.png",
            sfx: "¡gotea!",
            bubbles: [
              {
                id: "lim-1b-c",
                speaker: "child",
                text: "La pista dice: donde el agua canta.",
              },
              {
                id: "lim-1b-p",
                speaker: "parent",
                text: "Es la regadera roja. Siempre tararea.",
              },
            ],
            actors: pair("point", "stand"),
          },
        ],
      },
      {
        id: "lim-2",
        panels: [
          {
            id: "lim-2a",
            scene: "garden-path",
            art: "/art/scene-lim-2a.png",
            sfx: "¡ja, ja!",
            bubbles: [
              {
                id: "lim-2a-c",
                speaker: "child",
                text: "Ahora toca caminar hacia atrás.",
              },
              {
                id: "lim-2a-p",
                speaker: "parent",
                text: "Si nos caemos, el mapa no se entera.",
              },
            ],
            actors: pair("jump", "play"),
          },
          {
            id: "lim-2b",
            scene: "garden-box",
            art: "/art/scene-lim-2b.png",
            bubbles: [
              {
                id: "lim-2b-c",
                speaker: "child",
                text: "¡Una caja de galletas!",
              },
              {
                id: "lim-2b-p",
                speaker: "parent",
                text: "Ábrela despacito. Los tesoros son tímidos.",
              },
            ],
            actors: pair("cheer", "peek"),
          },
        ],
      },
      {
        id: "lim-3",
        panels: [
          {
            id: "lim-3a",
            scene: "garden-crowns",
            art: "/art/scene-lim-3a.png",
            caption: "Dentro había dos coronas y una nota.",
            bubbles: [
              {
                id: "lim-3a-c",
                speaker: "child",
                text: "«Para cuando reinemos sobre {{favorite}}».",
              },
              {
                id: "lim-3a-p",
                speaker: "parent",
                text: "Entonces hoy mandamos nosotros. Cuidado con las hormigas.",
              },
            ],
            actors: pair("cheer", "wave"),
          },
          {
            id: "lim-3b",
            scene: "garden-hug",
            art: "/art/scene-lim-3b.png",
            caption: "El limonero guardó el secreto.",
            bubbles: [
              {
                id: "lim-3b-c",
                speaker: "child",
                text: "Mañana escondemos otro mapa.",
              },
              {
                id: "lim-3b-p",
                speaker: "parent",
                text: "Trato, {{child}}. Trato de {{role}}.",
              },
            ],
            actors: pair("hug", "hug", "close"),
          },
        ],
      },
    ],
  },
  {
    id: "manta",
    title: "La nave de la manta",
    blurb:
      "Un día de lluvia, dos sillas y una linterna alcanzan para llegar a la cocina.",
    cover: "fort",
    coverArt: "/art/scene-man-cover.jpg",
    pages: [
      {
        id: "man-1",
        panels: [
          {
            id: "man-1a",
            scene: "rain-room",
            art: "/art/scene-man-1a.png",
            caption: "Llovía tanto que el patio se volvió mar.",
            bubbles: [
              {
                id: "man-1a-c",
                speaker: "child",
                text: "Hoy no podemos salir a buscar {{favorite}}.",
              },
              {
                id: "man-1a-p",
                speaker: "parent",
                text: "Podemos salir sin mojarnos. Hace falta una nave.",
              },
            ],
            actors: pair("peek", "point"),
          },
          {
            id: "man-1b",
            scene: "fort",
            art: "/art/scene-man-1b.png",
            sfx: "¡fum!",
            bubbles: [
              {
                id: "man-1b-c",
                speaker: "child",
                text: "La linterna será la luna.",
              },
              {
                id: "man-1b-p",
                speaker: "parent",
                text: "La manta es el casco. Las sillas, los motores.",
              },
            ],
            actors: pair("cheer", "play"),
          },
        ],
      },
      {
        id: "man-2",
        panels: [
          {
            id: "man-2a",
            scene: "fort-inside",
            art: "/art/scene-man-2a.png",
            bubbles: [
              {
                id: "man-2a-c",
                speaker: "child",
                text: "Capitana {{child}} al habla. Rumbo a la cocina.",
              },
              {
                id: "man-2a-p",
                speaker: "parent",
                text: "{{parent}} al timón. Hay un calcetín en órbita.",
              },
            ],
            actors: pair("point", "peek", "close"),
          },
          {
            id: "man-2b",
            scene: "kitchen",
            art: "/art/scene-man-2b.png",
            caption: "En la cocina, las galletas tenían órbita.",
            bubbles: [
              {
                id: "man-2b-c",
                speaker: "child",
                text: "Pido permiso para aterrizar.",
              },
              {
                id: "man-2b-p",
                speaker: "parent",
                text: "Concedido. Una cada uno. El universo mira.",
              },
            ],
            actors: pair("point", "stand"),
          },
        ],
      },
      {
        id: "man-3",
        panels: [
          {
            id: "man-3a",
            scene: "bedroom",
            art: "/art/scene-man-3a.png",
            bubbles: [
              {
                id: "man-3a-c",
                speaker: "child",
                text: "Última parada: los peluches.",
              },
              {
                id: "man-3a-p",
                speaker: "parent",
                text: "Ahí viven los que cuidan {{favorite}}.",
              },
            ],
            actors: pair("wave", "stand"),
          },
          {
            id: "man-3b",
            scene: "bedroom-sleep",
            art: "/art/scene-man-3b.png",
            caption: "La nave se quedó hecha cama.",
            bubbles: [
              {
                id: "man-3b-c",
                speaker: "child",
                text: "Buenas noches, {{role}}.",
              },
              {
                id: "man-3b-p",
                speaker: "parent",
                text: "Buenas noches, capitana. Mañana hay más cielo.",
              },
            ],
            actors: pair("hug", "hug", "close"),
          },
        ],
      },
    ],
  },
  {
    id: "concierto",
    title: "El concierto de los calcetines",
    blurb:
      "Hay una banda, un público de una sola persona y un bis que no se puede saltar.",
    cover: "concert",
    coverArt: "/art/scene-con-cover.jpg",
    pages: [
      {
        id: "con-1",
        panels: [
          {
            id: "con-1a",
            scene: "band",
            art: "/art/scene-con-1a.png",
            bubbles: [
              {
                id: "con-1a-c",
                speaker: "child",
                text: "Hoy hay concierto. Tú eres todo el público.",
              },
              {
                id: "con-1a-p",
                speaker: "parent",
                text: "Tengo la mejor entrada: este cojín.",
              },
            ],
            actors: pair("cheer", "stand"),
          },
          {
            id: "con-1b",
            scene: "concert",
            art: "/art/scene-con-1b.png",
            sfx: "¡tin, tin!",
            bubbles: [
              {
                id: "con-1b-c",
                speaker: "child",
                text: "La banda se llama Los Calcetines Perdidos.",
              },
              {
                id: "con-1b-p",
                speaker: "parent",
                text: "Falta uno. Por eso suenan misteriosos.",
              },
            ],
            actors: pair("play", "cheer"),
          },
        ],
      },
      {
        id: "con-2",
        panels: [
          {
            id: "con-2a",
            scene: "concert",
            art: "/art/scene-con-2a.png",
            bubbles: [
              {
                id: "con-2a-c",
                speaker: "child",
                text: "Esta canción habla de {{favorite}}.",
              },
              {
                id: "con-2a-p",
                speaker: "parent",
                text: "El público pide otra. Y el público soy yo.",
              },
            ],
            actors: pair("wave", "cheer"),
          },
          {
            id: "con-2b",
            scene: "encore",
            art: "/art/scene-con-2b.png",
            caption: "El bis lo tocaron juntos.",
            bubbles: [
              {
                id: "con-2b-c",
                speaker: "child",
                text: "Yo hago la parte que suena a risa.",
              },
              {
                id: "con-2b-p",
                speaker: "parent",
                text: "Yo hago el bombo con la olla grande.",
              },
            ],
            actors: pair("play", "play"),
          },
        ],
      },
      {
        id: "con-3",
        panels: [
          {
            id: "con-3a",
            scene: "bow",
            art: "/art/scene-con-3a.png",
            bubbles: [
              {
                id: "con-3a-c",
                speaker: "child",
                text: "¡Gracias! Firmo calcetines a la salida.",
              },
              {
                id: "con-3a-p",
                speaker: "parent",
                text: "El público se levanta. Despacio: es el suelo.",
              },
            ],
            actors: pair("cheer", "wave"),
          },
          {
            id: "con-3b",
            scene: "lights-down",
            art: "/art/scene-con-3b.png",
            caption: "La lámpara se apagó. El teatro volvió a ser cuarto.",
            bubbles: [
              {
                id: "con-3b-c",
                speaker: "child",
                text: "¿Mañana repetimos la función?",
              },
              {
                id: "con-3b-p",
                speaker: "parent",
                text: "Mañana. Guardo la entrada en el bolsillo.",
              },
            ],
            actors: pair("hug", "hug", "close"),
          },
        ],
      },
    ],
  },
  {
    id: "charco",
    title: "El charco océano",
    blurb:
      "Después de la lluvia, las botas se vuelven barcos y la calle un mar chiquito.",
    cover: "puddle",
    coverArt: "/art/scene-cha-cover.jpg",
    pages: [
      {
        id: "cha-1",
        panels: [
          {
            id: "cha-1a",
            scene: "doorway",
            art: "/art/scene-cha-1a.png",
            caption: "Después de la lluvia, la calle hizo un mar chiquito.",
            bubbles: [
              {
                id: "cha-1a-c",
                speaker: "child",
                text: "Mis botas son un barco, {{role}}.",
              },
              {
                id: "cha-1a-p",
                speaker: "parent",
                text: "Las mías son un barco lento, de los que miran.",
              },
            ],
            actors: pair("point", "stand"),
          },
          {
            id: "cha-1b",
            scene: "puddle",
            art: "/art/scene-cha-1b.png",
            sfx: "¡splash!",
            bubbles: [
              {
                id: "cha-1b-c",
                speaker: "child",
                text: "¡Ese salto fue una ballena!",
              },
              {
                id: "cha-1b-p",
                speaker: "parent",
                text: "Yo me quedo de faro, aquí en el borde.",
              },
            ],
            actors: pair("jump", "wave"),
          },
        ],
      },
      {
        id: "cha-2",
        panels: [
          {
            id: "cha-2a",
            scene: "puddle-look",
            art: "/art/scene-cha-2a.png",
            bubbles: [
              {
                id: "cha-2a-c",
                speaker: "child",
                text: "Ahí abajo hay otra yo.",
              },
              {
                id: "cha-2a-p",
                speaker: "parent",
                text: "Y también estoy yo, saludando con las botas.",
              },
            ],
            actors: pair("peek", "peek"),
          },
          {
            id: "cha-2b",
            scene: "puddle-leaf",
            art: "/art/scene-cha-2b.png",
            bubbles: [
              {
                id: "cha-2b-c",
                speaker: "child",
                text: "La hoja lleva un recado.",
              },
              {
                id: "cha-2b-p",
                speaker: "parent",
                text: "Dice: hoy vimos {{favorite}} en el agua.",
              },
            ],
            actors: pair("point", "kneel"),
          },
        ],
      },
      {
        id: "cha-3",
        panels: [
          {
            id: "cha-3a",
            scene: "walk-home",
            art: "/art/scene-cha-3a.png",
            bubbles: [
              {
                id: "cha-3a-c",
                speaker: "child",
                text: "El charco ya está más flaco. Se duerme.",
              },
              {
                id: "cha-3a-p",
                speaker: "parent",
                text: "Los océanos también se cansan.",
              },
            ],
            actors: pair("wave", "stand"),
          },
          {
            id: "cha-3b",
            scene: "towels",
            art: "/art/scene-cha-3b.png",
            caption: "En la cocina, el mar se quedó en las botas.",
            bubbles: [
              {
                id: "cha-3b-c",
                speaker: "child",
                text: "Si mañana no llueve, ¿se acaba el mar?",
              },
              {
                id: "cha-3b-p",
                speaker: "parent",
                text: "Si no llueve, lo hacemos en la bañera. Cabemos los dos.",
              },
            ],
            actors: pair("hug", "hug", "close"),
          },
        ],
      },
    ],
  },
];

export function getStory(id: string) {
  return STORIES.find((story) => story.id === id) ?? STORIES[0];
}
