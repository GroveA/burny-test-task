import { Container, Sprite, Assets, getCanvasBoundingBox, Graphics, Text } from 'pixi.js';
import { textStyles } from '../configs/TextStyles';

export class PieceView extends Container {
    constructor(parent, pieceTexture) {
        super();

        parent.addChild(this);

        this.sprite = new Sprite({ texture: Assets.get(pieceTexture), anchor: 0.5 });

        this.text = new Text({
            text: '10 Pts',
            style: textStyles.piecePoints,
            anchor: { x: 0.5, y: 0 },
            position: { y: this.sprite.height / 2 + 10, x: 0 }
        });

        this.addChild(this.text);

        this.addChild(this.sprite);
    }

    setTexture(textureName) {
        this.sprite.texture = Assets.get(textureName);

        this.text.y = this.sprite.height / 2 + 10;
    }

    renderOrderTop() {
        this.zIndex = 1000;
    }

    renderOrderReset() {
        this.zIndex = 10;
    }
}
