import { TextStyle, Text, Sprite, ParticleContainer,Ticker } from "pixi.js";
import { Button } from "../core/components/Button";
import { BaseScene } from "../core/scene/BaseScene";
import { OrientationType } from "../core/types";
import { SceneManager } from "../core/scene/SceneManager";
import { SoundManager } from "../core/sound/SoundManager";

export class CaseThreeScene extends BaseScene {

    private _backHomeButton!: Button;
    private _titleText!: Text;
    private _fireParticleContainer!: ParticleContainer;
    private _particleEmitter: boolean = false; // Flag to control particle emission

    // Store additional data for each particle
    private _fire: Array<{
        particle: Sprite,
        vx: number,      // X velocity
        vy: number,      // Y velocity
        age: number,     // Current age of particle
        maxAge: number,  // Maximum lifetime
        rotation: number,
        scale: number,
        scaleSpeed: number,
        fadeSpeed: number,
        active: boolean  // Whether particle is currently active
    }> = [];

    constructor() {
        super();
        this.initDisplay();
    }

    private initDisplay(): void {
        // Create a ParticleContainer for better performance
        this._fireParticleContainer = new ParticleContainer(10, {
            scale: true,
            position: true,
            rotation: true,
            uvs: true,
            alpha: true
        });
        this._fireParticleContainer.position.set(0, 100); // Position the fire
        this.addChild(this._fireParticleContainer);

        // Add title text
        this._titleText = new Text('PHOENIX FLAME', new TextStyle({
            fill: 0xff6900,
            fontFamily: "sniglet-regular",
            fontWeight: "bold",
            fontSize: 72
        }));
        this._titleText.anchor.set(0.5);
        this._titleText.position.set(0, -200);
        this.addChild(this._titleText);

        // Add back button
        this._backHomeButton = new Button('buttonbg', 'Home', new TextStyle({
            fill: 0xfafafa,
            fontFamily: "sniglet-regular"
        }), this);
        this._backHomeButton.name = 'BackMainSceneButton';
        this._backHomeButton.position.set(0, 0);
        this._backHomeButton.onButtonClick(() => {
            SceneManager.instance.switchScene('MainScene');
        });
        this.addChild(this._backHomeButton);
        this.createParticle(); // Create fire particles
    }

    private createParticle(): void {
        // Create our fire particles
        for (let i = 0; i < 10; i++) {
            // Create fire particle sprite
            const fireParticle = Sprite.from('fire');
            fireParticle.anchor.set(0.5);

            // Set up initial properties for each particle
            const particle = {
                particle: fireParticle,
                vx: Math.random() * 0.4 - 0.2,         // Small random horizontal movement
                vy: -Math.random() * 1.5 - 1.5,        // Upward movement with randomness
                age: Math.random() * 2,                // Stagger initial ages
                maxAge: 2 + Math.random(),             // Slightly different lifetimes
                rotation: Math.random() * Math.PI * 2, // Random rotation
                scale: 0.2 + Math.random() * 0.2,      // Random initial scale
                scaleSpeed: 0.01 + Math.random() * 0.03, // Growth rate
                fadeSpeed: 0.01 + Math.random() * 0.02,  // Fade out rate
                active: true
            };

            // Initialize particle appearance
            this.resetParticle(particle, true);

            // Add to container and tracking array
            this._fireParticleContainer.addChild(fireParticle);
            this._fire.push(particle);
        }
    }

    private resetParticle(particleData: any, isInitial: boolean = false): void {
        const { particle } = particleData;

        // Position at base of flame with some random horizontal offset
        particle.position.x = Math.random() * 5 - 2;

        // For initial setup, distribute particles vertically
        if (isInitial) {
            particle.position.y = Math.random() * 30;
        } else {
            // New particles start at the bottom
            particle.position.y = 0;
        }

        // Start small and fully visible
        particle.alpha = 1.0;
        particle.scale.set(0.1); // Start smaller than before

        // Start with red/orange color
        particle.tint = 0xff3300; // Start with red

        // Reset age
        particleData.age = 0;

        // Set as active
        particleData.active = true;

        // Randomize velocity slightly each time
        particleData.vx = Math.random() * 0.4 - 0.2;
        particleData.vy = -Math.random() * 1.5 - 1.5;
        particleData.rotation = Math.random() * 0.1 - 0.05; // Slight rotation

        // Set growth rate - first grows, then shrinks
        particleData.scaleSpeed = 0.01 + Math.random() * 0.02;

        // Set fade speed - more gradual fade
        particleData.fadeSpeed = 0.005 + Math.random() * 0.01; // Slower fade
    }

    private updateParticles(delta: number): void {
        // Normalize delta to avoid inconsistencies at different frame rates
        const normalizedDelta = delta / 60;

        // Update each particle
        for (let i = 0; i < this._fire.length; i++) {
            const particleData = this._fire[i];
            const { particle } = particleData;

            if (particleData.active) {
                // Update age
                particleData.age += normalizedDelta;

                // Apply physics
                particle.position.x += particleData.vx * normalizedDelta;
                particle.position.y += particleData.vy * normalizedDelta;

                // Make particles slow down as they rise
                particleData.vy += 0.05 * normalizedDelta;

                // Add some "flickering" by adjusting x velocity slightly
                particleData.vx += (Math.random() - 0.5) * 0.2 * normalizedDelta;

                // Apply rotation
                particle.rotation += particleData.rotation * normalizedDelta;

                // Calculate life progress (0 to 1)
                const lifeProgress = Math.min(particleData.age / particleData.maxAge, 1);

                // Growth pattern: grow until halfway, then shrink
                if (lifeProgress < 0.5) {
                    // Growth phase - increase size
                    const growthScale = 0.1 + lifeProgress * 1.0; // Max size around 0.6
                    particle.scale.set(growthScale);
                } else {
                    // Shrink phase - decrease size gradually
                    const shrinkScale = 0.6 - ((lifeProgress - 0.5) * 0.4);
                    particle.scale.set(shrinkScale);
                }

                // More gradual fading throughout lifetime
                // Start fading earlier at 30% of lifetime, completely transparent by end
                if (lifeProgress > 0.3) {
                    // Map 0.3-1.0 to 1.0-0.0 for alpha
                    const fadeProgress = (lifeProgress - 0.3) / 0.7;
                    particle.alpha = Math.max(0, 1.0 - fadeProgress);
                }

                // Change color as it ages (red -> orange -> yellow)
                if (lifeProgress < 0.3) {
                    particle.tint = 0xff3300; // Red
                } else if (lifeProgress < 0.6) {
                    particle.tint = 0xff6600; // Orange-red
                } else if (lifeProgress < 0.8) {
                    particle.tint = 0xff9900; // Orange
                } else {
                    particle.tint = 0xffcc00; // Yellow
                }

                // Check if particle should be reset - only if completely invisible
                if (lifeProgress >= 1.0 || particle.alpha <= 0.01) {
                    this.resetParticle(particleData);
                }
            }
        }

    }

    public update(delta: number): void {
        if(this._particleEmitter) {
            this.updateParticles(delta);
        }
    }

    public onShow(): void {
        // Reset all particles when showing the scene
        // this._fire.forEach(particleData => {
        //     this.resetParticle(particleData, true);
        // });
        this._particleEmitter = true; // Start emitting particles
        SoundManager.instance.playSound('EffectFire', { loop: true, volume: 0.05 });
    }

    public onHide(): void {  
        this.dispose();
    }

    private dispose(): void {
        // Dispose of particles and any other resources
        SoundManager.instance.stopSound('EffectFire');
        this._particleEmitter = false; // Stop emitting particles
      
    }

    public resize(): void {
        this.onOrientationChange(this._currentOrientation);
    }

    public onOrientationChange(orientation: OrientationType): void {
        switch (orientation) {
            case OrientationType.PORTRAIT:
                this._backHomeButton.position.set(-200, -450);
                this._titleText.position.set(0, -350);
                this._fireParticleContainer.position.set(0, 150);
                break;
            case OrientationType.LANDSCAPE:
                this._backHomeButton.position.set(-500, -400);
                this._backHomeButton.scale.set(1.5);
                this._titleText.position.set(0, -200);
                this._fireParticleContainer.position.set(0, 100);
                break;
            default:
                break;
        }
    }
}