import { Container, Sprite, Text, TextStyle, Container as PixiContainer } from "pixi.js";
export class DialogPopup extends Container {
    private _dialogueText!: Text;
    private _background!: Sprite;
    private _avatar!: Sprite;
    private dialogPosition: string = 'left';
    private _dialogueTextStyle!: TextStyle;
    private _textContainer!: Container;

    constructor(backgroundTexture: string, textStyle: any, avatarTexture: string, dialogPosition: string = 'left') {
        super();

        this.dialogPosition = dialogPosition;
        this.initDisplay(backgroundTexture, textStyle, avatarTexture);
    }

    private initDisplay(backgroundTexture: string, textStyle: TextStyle, avatarTexture: string): void {
        this._background = Sprite.from(backgroundTexture);
        this._background.anchor.set(0.5);
        this._background.scale.set(1.5, 0.5);
        this._background.position.set(0, 0);
        this.addChild(this._background);
        this._avatar = Sprite.from(avatarTexture);
        this._avatar.anchor.set(0.5);
        this._avatar.position.set(-this._background.width / 2 + 50, -this._background.height / 2 + 50);
        this.addChild(this._avatar);
        this._dialogueTextStyle = textStyle;

        this._textContainer = new Container();
        this.addChild(this._textContainer);
    }

    public show(dialogText: string): void {
        // Clear previous text content
        if (this._textContainer) {
            this._textContainer.removeChildren();
        }
        // Process text with emojis
        this.createTextWithEmojis(dialogText);
        this.visible = true;
    }

    private createTextWithEmojis(dialogText: string): void {
        const emojiRegex = /\{([^}]+)\}/g;
        const textParts = dialogText.split(emojiRegex);
        
        let currentX = 0;
        let currentY = 0;
        const lineHeight = 36; // Adjust based on your font size
    
        // Calculate available space correctly
        const padding = 50; // Padding from edges
        const avatarSpace = this._avatar.width + padding;
        const maxWidth = this._background.width - padding * 2;
    
        // Position the text container to avoid the avatar
        const startX = avatarSpace / 2;
        const startY = -this._background.height / 3; // Start in upper portion of background
    
        this._textContainer.position.set(-startX, startY);
        
        // Break the text into word chunks for better wrapping
        for (let i = 0; i < textParts.length; i++) {
            const part = textParts[i];
    
            // Even indices are text, odd indices are emoji codes
            if (i % 2 === 0) {
                // This is regular text
                if (part.trim() === '') continue;
                
                // Split the text into words
                const words = part.split(' ');
                
                for (let j = 0; j < words.length; j++) {
                    const word = words[j] + (j < words.length - 1 ? ' ' : '');
                    
                    // Create a temporary text to measure its width
                    const tempText = new Text(word, {
                        ...this._dialogueTextStyle,
                        fontSize: 24,
                        fill: 0x000000,
                        fontWeight: "bold"
                    });
                    
                    // Check if this word would overflow the line
                    if (currentX + tempText.width > maxWidth && currentX > 0) {
                        // Move to next line
                        currentX = 0;
                        currentY += lineHeight;
                    }
                    
                    // Create the actual text
                    const text = new Text(word, {
                        ...this._dialogueTextStyle,
                        fontSize: 24,
                        fill: 0x000000,
                        fontWeight: "bold"
                    });
                    
                    text.position.set(currentX, currentY);
                    this._textContainer.addChild(text);
                    
                    // Update position for next element
                    currentX += text.width;
                }
            } else {
                // This is an emoji code
                try {
                    // Use the emoji code as the texture name
                    const emoji = Sprite.from(part);
                    emoji.width = lineHeight;
                    emoji.height = lineHeight;
                    emoji.anchor.set(0, 0.5);
                    
                    // Check if emoji would overflow the line
                    if (currentX + emoji.width > maxWidth) {
                        currentX = 0;
                        currentY += lineHeight;
                    }
                    
                    emoji.position.set(currentX, currentY + lineHeight / 2);
                    this._textContainer.addChild(emoji);
                    
                    // Update current position
                    currentX += emoji.width;
                } catch (error) {
                    console.error(`Failed to load emoji: ${part}`, error);
                    // Handle missing texture gracefully
                    const fallback = new Text(`{${part}}`, {
                        ...this._dialogueTextStyle,
                        fontSize: 24,
                        fill: 0xFF0000
                    });
                    fallback.position.set(currentX, currentY);
                    this._textContainer.addChild(fallback);
                    currentX += fallback.width;
                }
            }
        }
        
        // Check if text container exceeds background height and scale down if needed
        const maxHeight = this._background.height - padding;
        if (this._textContainer.height > maxHeight) {
            const scale = maxHeight / this._textContainer.height;
            this._textContainer.scale.set(scale);
        }
    }

    public hide(): void {
        this.visible = false;
    }
}