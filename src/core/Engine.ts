import { Application, Container, Assets, Text, TextStyle } from 'pixi.js';
import { resize } from './resize/resize';
import { PORTRAITSIZE, LANDSCAPESIZE, SAFESIZE, SPRITES } from './config';
import { OrientationType } from './types';
import { SceneManager } from './scene/SceneManager';
import { SoundManager } from './sound/SoundManager';
import { SOUNDS } from './sound/config';

export class Engine {
    private _app: Application;
    private _mainContainer: Container = new Container();
    private _currentOrientation: OrientationType = OrientationType.LANDSCAPE;
    private readonly _backgroudColor: string = '#ccc'; // Default background color

    // FPS Counter properties
    private _fpsText: Text;
    private _frameCount: number = 0;
    private _lastTime: number = 0;
    private _fpsUpdateInterval: number = 1000; // Update FPS display every 1 second

    constructor() {
        this._app = new Application();
        (globalThis as any).__PIXI_APP__ = this._app;// For debugging purposes

        // Create FPS counter text
        this._fpsText = new Text('FPS: 0', new TextStyle({
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0x9BEC00,
            stroke: 0x000000,
            strokeThickness: 4,
            align: 'left'
        }));
    }

    async init() {
        this._app = new Application({
            background: this._backgroudColor,
            resizeTo: window,
            resolution: 1,
            antialias: false,
            autoDensity: true,
        });
        document.getElementById("pixi-container")!.appendChild(this._app.view as HTMLCanvasElement);

        this._mainContainer = new Container();
        this._mainContainer.name = 'mainContainer';
        this._app.stage.addChild(this._mainContainer);

        // Initialize FPS counter
        this.initFPSCounter();

        // Add resize event listener
        window.addEventListener('resize', this.handleResize.bind(this));
        window.addEventListener('orientationchange', () => {
            setTimeout(this.handleResize.bind(this), 100);
        }); // Add orientation change event listener

        this.handleResize(); // Initial resize
        await this.loadAssets();
        await this.loadSounds();
        await this.loadFonts();
        this.initGameLoop();
        return this;
    }

    private initFPSCounter(): void {
        // Position FPS counter in top-left corner
        this._fpsText.position.set(0, 0);
        // Add to stage (not mainContainer) to avoid scaling issues
        this._app.stage.addChild(this._fpsText);
        // Initialize timing
        this._lastTime = performance.now();
        this._frameCount = 0;
    }

    private updateFPSCounter(): void {
        this._frameCount++;

        const currentTime = performance.now();
        const elapsed = currentTime - this._lastTime;

        // Update FPS every second
        if (elapsed >= this._fpsUpdateInterval) {
            const fps = Math.round((this._frameCount * 1000) / elapsed);
            this._fpsText.text = `FPS: ${fps}`;

            // Reset counters
            this._frameCount = 0;
            this._lastTime = currentTime;
        }
    }

    private async loadAssets() {
        await Assets.load(SPRITES);
    }

    private async loadFonts() {
        const fontFace = new FontFace('sniglet-regular', 'url(assets/fonts/Sniglet-Regular.ttf)');
        try {
            // Fontun yüklenmesini bekle
            await fontFace.load();
            document.fonts.add(fontFace);
        } catch (err) {
            console.error("Font yüklenemedi:", err);
        }
    }

    private async loadSounds() {
        await SoundManager.instance.loadSounds(SOUNDS);
    }

    private initGameLoop(): void {
        this._app.ticker.add((delta: number) => {
            // Update FPS counter
            this.updateFPSCounter();

            // Update game
            SceneManager.instance.update(delta);
        });
    }

    private detectOrientation(): void {
        this._currentOrientation = window.innerWidth > window.innerHeight ?
            OrientationType.LANDSCAPE :
            OrientationType.PORTRAIT;
    }

    private handleResize(): void {
        this.detectOrientation();
        let gameSize = this._currentOrientation === OrientationType.LANDSCAPE ? LANDSCAPESIZE : PORTRAITSIZE;
        const { width, height } = resize(
            gameSize.width,
            gameSize.height,
            SAFESIZE.width,
            SAFESIZE.height,
            true
        );

        // Update renderer size
        this._app.renderer.resize(width, height);

        // Keep FPS counter in the corner after resize
        const fpsTextPosition = this._currentOrientation === OrientationType.LANDSCAPE ?
            { x: this._fpsText.width + 10, y: this._fpsText.height + 10 } : // Top-left corner for landscape
            { x: 10, y: 10 }; // Bottom-right corner for portrait
        this._fpsText.position.set(fpsTextPosition.x, fpsTextPosition.y);
        // this._fpsText.scale.set(1 / this._mainContainer.scale.x, 1 / this._mainContainer.scale.y);

        let scale: number;

        if (this._currentOrientation === OrientationType.PORTRAIT) {
            // Dynamic safety margin based on screen aspect ratio
            const aspectRatio = window.innerHeight / window.innerWidth;
            const safetyMargin = aspectRatio > 2 ? 0.65 : // Uzun telefonlar için (iPhone 12 Pro gibi)
                aspectRatio > 1.6 ? 0.75 : // Orta boy telefonlar için (iPhone SE gibi)
                    0.9; // Diğer durumlar için

            scale = (width / gameSize.width) * safetyMargin;
        } else {
            scale = Math.min(
                width / gameSize.width,
                height / gameSize.height
            );
        }

        this._mainContainer.scale.set(scale);
        this._mainContainer.x = width / 2;
        this._mainContainer.y = height / 2;

    }

    public addChild(object: any) {
        object.position.set(0, 0); // This will be center since mainContainer is centered
        this._mainContainer.addChild(object);
    }

    public get app() {
        return this._app;
    }
    public get mainContainer(): Container {
        return this._mainContainer;
    }
}