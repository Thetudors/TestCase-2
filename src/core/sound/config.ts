import { SoundChannel, SoundConfig } from "./types";

export const SOUNDS: SoundConfig[] = [
    {
        alias: "EffectCardMove",
        url: "assets/sounds/card_move.mp3",
        soundChannel: SoundChannel.EFFECT,
    },
    {
        alias: "EffectFire",
        url: "assets/sounds/fire.mp3",
        soundChannel: SoundChannel.EFFECT,
    },
    {
        alias: "EffectPopup",
        url: "assets/sounds/popup.mp3",
        soundChannel: SoundChannel.EFFECT,
    }
];