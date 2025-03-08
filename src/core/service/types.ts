export interface MagicWordsResponse {
    dialogue: Dialogue[];
    emojies: Emoji[];
    avatars: Avatar[];

    // Add any other properties from the actual response
}
export interface Dialogue {
    name: string;
    text: string;
}
export interface Emoji {
    name: string;
    url: string;
}
export interface Avatar {
    name: string;
    url: string;
    position: string;
}