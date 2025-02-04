import { textStyles } from '../configs/TextStyles';
import { Text, Container } from 'pixi.js';
import TextAnimations from '../animations/TextAnimations';
export class IqScoreText extends Container {
    constructor(parent) {
        super();

        this.labelText = new Text({ text: 'IQ =', style: textStyles.iqText, anchor: { x: 1, y: 0.5 } });

        this.addChild(this.labelText);

        this.baseScore = 60;
        this.score = { value: this.baseScore };

        this.scoreText = new Text({
            text: this.score.value,
            style: textStyles.iqText,
            anchor: { x: 0, y: 0.5 },
            position: { x: 15, y: 0 }
        });
        this.addChild(this.scoreText);

        parent.addChild(this);
    }

    updateScore(pieceCount) {
        TextAnimations.setScore(this, this.baseScore + pieceCount * 10);
    }
}
