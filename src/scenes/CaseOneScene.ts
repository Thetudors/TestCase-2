import { TextStyle, Text, Sprite, Container } from "pixi.js";
import { Button } from "../core/components/Button";
import { BaseScene } from "../core/scene/BaseScene";
import { OrientationType } from "../core/types";
import { SceneManager } from "../core/scene/SceneManager";
import { gsap } from "gsap";
import { SoundManager } from "../core/sound/SoundManager";

export class CaseOneScene extends BaseScene {

    private _backHomeButton!: Button;
    private _titleText!: Text;
    private _cardContainer!: Container;
    private _leftStackContainer!: Container;
    private _rightStackContainer!: Container;
    private _cardsLeftStack: Sprite[] = [];
    private _cardsRightStack: Sprite[] = [];

    private _currentCardStack: Sprite[] = [];
    private _currentCardIndex: number = 0;
    private _currentContainer!: Container;
    private _targetContainer!: Container;

    private readonly CARD_COUNT: number = 144; // Number of cards in the stack
    private readonly CARD_ANIMATION_DURATION: number = 2; // Duration of the card animation in seconds
    private readonly CARD_ANIMATION_INTERVAL: number = 1000; // Interval between card animations in milliseconds

    private _animationInterval: number | null = null;


    constructor() {
        super();
        this.initDisplay();
    }

    private initDisplay(): void {

        this._titleText = new Text('ACE OF SHADOWS', new TextStyle({ fill: 0xff6900, fontFamily: "sniglet-regular", fontWeight: "bold", fontSize: 72 }));
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

        this._cardContainer = new Container();
        this._cardContainer.name = 'CardContainer';
        this._cardContainer.position.set(0, 0);
        this.addChild(this._cardContainer);

        this._leftStackContainer = new Container();
        this._leftStackContainer.name = 'LeftStackContainer';
        this._leftStackContainer.position.set(-200, 0);
        this._cardContainer.addChild(this._leftStackContainer);

        this._rightStackContainer = new Container();
        this._rightStackContainer.name = 'RightStackContainer';
        this._rightStackContainer.position.set(200, 0);
        this._cardContainer.addChild(this._rightStackContainer);

        this._cardsLeftStack = [];
        for (let i = 0; i < this.CARD_COUNT; i++) {
            const card = Sprite.from('card-' + (i % 2));
            card.anchor.set(0.5);
            card.position.set(0, 0 + i);
            this._cardsLeftStack.push(card);
            this._leftStackContainer.addChild(card);
        }

        this._currentCardStack = [...this._cardsLeftStack];
        this._currentContainer = this._leftStackContainer;
        this._targetContainer = this._rightStackContainer;
    }

    private playCardMoveAnimation(): void {
        const lastCard = this._currentCardStack.pop();

        if (lastCard) {
            this._cardsRightStack.push(lastCard);
            const globalPos = lastCard.getGlobalPosition();
            this._targetContainer.addChild(lastCard);
            const localPos = this._targetContainer.toLocal(globalPos);
            lastCard.position.copyFrom(localPos);
            this._currentCardIndex++;
            gsap.to(lastCard.position, {
                x: 0,
                y: this._currentCardIndex,
                duration: this.CARD_ANIMATION_DURATION,
                ease: "power1.inOut",
                onStart: () => {
                    SoundManager.instance.playSound('EffectCardMove', { volume: 0.5 });
                }
            });
        }
    }

    public onShow(): void {
        this._animationInterval = setInterval(() => {
            if (this._currentCardStack.length > 0) {
                this.playCardMoveAnimation();
            } else {
                this._currentContainer = this._currentContainer === this._leftStackContainer ? this._rightStackContainer : this._leftStackContainer;
                this._targetContainer = this._targetContainer === this._leftStackContainer ? this._rightStackContainer : this._leftStackContainer;
                this._currentCardStack = this._currentContainer === this._leftStackContainer ? [...this._cardsLeftStack] : [...this._cardsRightStack];
                this._currentCardIndex = 0;
            }
        }, this.CARD_ANIMATION_INTERVAL);
    }

    public onHide(): void {
        this.dispose();
    }

    public update(delta: number): void {
    }
    private dispose(): void {
        if (this._animationInterval !== null) {
            clearInterval(this._animationInterval);
            this._animationInterval = null;
        }

        gsap.killTweensOf(this._currentCardStack);
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