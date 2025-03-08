import { Container, Point, Assets, Sprite, TextStyle } from "pixi.js";
import { Dialogue, MagicWordsResponse } from "../core/service/types";
import { ApiService } from "../core/service/ApiService";
import { DialogPopup } from "../components/DialogPopup";

export class DialogManager extends Container {
    private _magicWords!: MagicWordsResponse;
    private _diaglogues!: Dialogue[];
    private _dialougePopups!: Map<string, DialogPopup>;
    private _dialogueIndex: number = 0;


    constructor() {
        super();

        this._dialougePopups = new Map<string, DialogPopup>();
        this.loadMagicWords().catch(error => console.error('Failed to initialize:', error)).then(() => {
            this.createDialogPopups();
            this.showNextDialogue();
        });
    }



    private createDialogPopups(): void {
        this._magicWords.avatars.forEach((avatar, index) => {
            const dialogPopup = new DialogPopup("rect", new TextStyle({ fill: 0xfafafa, fontFamily: "sniglet-regular" }), avatar.name, avatar.position);
            dialogPopup.position.set(avatar.position === "right" ? 100 : -100, avatar.position === "right" ? 0 : 200);
            dialogPopup.hide();
            this.addChild(dialogPopup);
            this._dialougePopups.set(avatar.name, dialogPopup);


        });
    }
    public showNextDialogue(): void {
        this._dialougePopups.forEach(element => {
            element.hide();
        });
        const dialog = this._diaglogues[this._dialogueIndex];
        if (this._dialougePopups.has(dialog.name)) {
            const dialogPopup = this._dialougePopups.get(dialog.name);
            dialogPopup?.show(dialog.text);
        }
        this._dialogueIndex++;
        if (this._dialogueIndex >= this._diaglogues.length) {
            this._dialogueIndex = 0;
        }

    }

    private async loadMagicWords(): Promise<void> {
        try {
            const apiService = ApiService.instance;
            const response = await apiService.getMagicWords();
            this._magicWords = response;
            this._diaglogues = response.dialogue;
            console.log('Magic words loaded:', response);
            response.avatars.forEach(async (avatar) => {
                //This is not working because cors issue i guess
                //await this.loadTextures(avatar.name, avatar.url);
            });
            response.emojies.forEach(async (emoji) => {
                //This is not working because cors issue i guess
                // await this.loadTextures(emoji.name, emoji.url);
            });

        } catch (error) {
            console.error('Failed to load magic words:', error);
        }
    }
    private async loadTextures(alias: string, url: string): Promise<void> {
        try {
            console.log(`Loading texture: ${alias} from ${url}`);
            const encodedUrl = encodeURI(url);
            // Properly await the asset loading
            await Assets.load({ alias: alias, src: encodedUrl });
            console.log(`Texture loaded successfully: ${alias}`);
        } catch (error) {
            console.error(`Failed to load texture: ${alias}`, error);
            throw error;
        }
    }

    private dispose(): void {

    }
    public destroy(): void {
        this.dispose();
        super.destroy({ children: true });
    }

}