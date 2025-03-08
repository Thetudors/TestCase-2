import { Sprite, TextStyle, ParticleContainer, Texture, Ticker, Text } from "pixi.js";
import { Button } from "../core/components/Button";
import { BaseScene } from "../core/scene/BaseScene";
import { OrientationType } from "../core/types";
import { SceneManager } from "../core/scene/SceneManager";
import { gsap } from "gsap";
import { SoundManager } from "../core/sound/SoundManager";

export class MainScene extends BaseScene {

    private _aceOfShadowButton!: Button;
    private _magicWordsButton!: Button;
    private _phoenixFlameButton!: Button;
    private _titleText!: Text;
    constructor() {
        super();
        this.initDisplay();
        this.eventListeners();
    }

    private eventListeners(): void {

    }
    private dispose(): void {

    }

    private initDisplay(): void {
        // this._background = Sprite.from('mainscenebackground');
        // this._background.anchor.set(0.5);
        // this._background.name = 'MainSceneBackground';
        // this.addChild(this._background);

        this._titleText = new Text('SOFTGAMES CASE', new TextStyle({ fill: 0xff6900, fontFamily: "sniglet-regular", fontWeight: "bold", fontSize: 72 }));
        this._titleText.anchor.set(0.5);
        this._titleText.position.set(0, -200);
        this.addChild(this._titleText);


      
        this._aceOfShadowButton = new Button('buttonbg', 'Ace Of Shadows', new TextStyle({ fill: 0xfafafa, fontFamily: "sniglet-regular" }), this);
        this._aceOfShadowButton.name = 'AceOfShadowButton';
        this._aceOfShadowButton.scale.set(1.5);
        this._aceOfShadowButton.position.set(0, -300);
        this._aceOfShadowButton.onButtonClick(() => {
            SceneManager.instance.switchScene('CaseOneScene');
        });

        this._magicWordsButton = new Button('buttonbg', 'Magic Words', new TextStyle({ fill: 0xfafafa, fontFamily: "sniglet-regular" }), this);
        this._magicWordsButton.name = 'MagicWordsButton';
        this._magicWordsButton.scale.set(1.5);
        this._magicWordsButton.position.set(0, -300);
        this._magicWordsButton.onButtonClick(() => {
            SceneManager.instance.switchScene('CaseTwoScene');
        });

        this._phoenixFlameButton = new Button('buttonbg', 'Phoenix Flame', new TextStyle({ fill: 0xfafafa, fontFamily: "sniglet-regular" }), this);
        this._phoenixFlameButton.name = 'PhoenixFlameButton';
        this._phoenixFlameButton.scale.set(1.5);
        this._phoenixFlameButton.position.set(0, -300);
        this._phoenixFlameButton.onButtonClick(() => {
            console.log('Phoenix Flame Button Clicked');
        });
    }


    public onShow(): void {
        SoundManager.instance.playSound('theme', { loop: true, volume: 0.05 });
    }

    public onHide(): void {

        this.dispose();
        SoundManager.instance.stopSound('theme');
    }

    public update(delta: number): void {
    }

    public resize(): void {
        this.onOrientationChange(this._currentOrientation);
    }

    public onOrientationChange(orientation: OrientationType): void {

        switch (orientation) {
            case OrientationType.PORTRAIT:
                this._aceOfShadowButton.position.set(0, -100);
                this._magicWordsButton.position.set(0, 0);
                this._phoenixFlameButton.position.set(0, 100);
                this._titleText.position.set(0, -200);
                break;
            case OrientationType.LANDSCAPE:
                this._aceOfShadowButton.position.set(0, 0);
                this._magicWordsButton.position.set(0, 100);
                this._phoenixFlameButton.position.set(0, 200);
                this._titleText.position.set(0, -200);
                break;
            default:
                break;
        }
    }
}