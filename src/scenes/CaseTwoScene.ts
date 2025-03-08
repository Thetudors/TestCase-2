import { TextStyle, Text} from "pixi.js";
import { Button } from "../core/components/Button";
import { BaseScene } from "../core/scene/BaseScene";
import { OrientationType } from "../core/types";
import { SceneManager } from "../core/scene/SceneManager";
import { DialogManager } from "../managers/DialogManager";


export class CaseTwoScene extends BaseScene {

    private _backHomeButton!: Button;
    private _titleText!: Text;
    private _dialogManager!: DialogManager;
    private _nextDialogButton!: Button;


    constructor() {
        super();
        this.initDisplay();
     
    }

    private initDisplay(): void {
        this._titleText = new Text('MAGIC WORDS', new TextStyle({ fill: 0xff6900, fontFamily: "sniglet-regular", fontWeight: "bold", fontSize: 72 }));
        this._titleText.anchor.set(0.5);
        this._titleText.position.set(0, -200);
        this.addChild(this._titleText);

        this._backHomeButton = new Button('buttonbg', 'Home', new TextStyle({ fill: 0xfafafa, fontFamily: "sniglet-regular" }), this);
        this._backHomeButton.name = 'BackMainSceneButton';
        this._backHomeButton.position.set(0, 0);
        this._backHomeButton.onButtonClick(() => {
            SceneManager.instance.switchScene('MainScene');
        });
        this.addChild(this._backHomeButton);

        this._dialogManager = new DialogManager();
        this.addChild(this._dialogManager);



        this._nextDialogButton = new Button('buttonbg', 'Next Dialog', new TextStyle({ fill: 0xfafafa, fontFamily: "sniglet-regular" }), this);
        this._nextDialogButton.position.set(0, 400);
        this._nextDialogButton.onButtonClick(() => {
            this._dialogManager.showNextDialogue();
        });
        this.addChild(this._nextDialogButton);
      
    }

   

    public onShow(): void {
       
    }

    public onHide(): void {
        this.dispose();
    }

    public update(delta: number): void {
    }
    private dispose(): void {
      
    }

    public resize(): void {
        this.onOrientationChange(this._currentOrientation);
    }

    public onOrientationChange(orientation: OrientationType): void {

        switch (orientation) {
            case OrientationType.PORTRAIT:
                this._backHomeButton.position.set(-200, -450);
                this._titleText.position.set(0, -350);
                break;
            case OrientationType.LANDSCAPE:
                this._backHomeButton.position.set(-500, -400);
                this._backHomeButton.scale.set(1.5);
                this._titleText.position.set(0, -200);
                break;
            default:
                break;
        }
    }
}