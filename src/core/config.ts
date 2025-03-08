import { GameSize, spriteConfig } from "./types";

export const PORTRAITSIZE: GameSize = { width: 480, height: 800 };
export const LANDSCAPESIZE: GameSize = { width: 1920, height: 1080 };
export const SAFESIZE: GameSize = { width: 800, height: 600 };


export const SPRITES: spriteConfig[] = [
    { alias: "buttonbg", src: "/assets/sprites/button_bg.png" },
    { alias: "card-0", src: "/assets/sprites/card_0.png" },
    { alias: "card-1", src: "/assets/sprites/card_1.png" },
    { alias: "sad", src: "/assets/sprites/sad.png" },
    { alias: "intrigued", src: "/assets/sprites/intrigued.png" },
    { alias: "satisfied", src: "/assets/sprites/satisfied.png" },
    { alias: "neutral", src: "/assets/sprites/neutral.png" },
    { alias: "laughing", src: "/assets/sprites/laughing.png" },
    { alias: "Sheldon", src: "/assets/sprites/Sheldon.png" },
    { alias: "Penny", src: "/assets/sprites/Penny.png" },
    { alias: "Leonard", src: "/assets/sprites/Leonard.png" },
    { alias: "rect", src: "/assets/sprites/rect.png" },


]

export const FONTS: FontFace[] = [
    new FontFace('sniglet-regular', 'url(assets/fonts/Sniglet-Regular.ttf)')
];