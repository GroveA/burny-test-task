import { Text } from 'pixi.js';
import { textStyles } from '../configs/TextStyles';
import gsap from 'gsap';

export class PopupText extends Text {
    constructor(parent) {
        super({ text: '', style: textStyles.failText, anchor: 0.5, alpha: 0 });

        parent.addChild(this);
    }

    showSuccess() {
        this.text = 'WELL DONE!';

        this.style = textStyles.successText;
        gsap.fromTo(
            this,
            { pixi: { alpha: 0, scale: 0.5, pivotY: 0, skewY: -10, skewX: -10 } },
            {
                pixi: { alpha: 1, scale: 1, pivotY: 100, skewY: 0, skewX: 0 },
                ease: 'elastic.out(1,0.4)',

                duration: 0.8,
                yoyo: true,
                repeat: 1
            }
        );
    }

    showFail() {
        this.text = 'FAIL';
        this.style = textStyles.failText;

        gsap.fromTo(
            this,
            { pixi: { alpha: 0, scale: 0.5, pivotY: 0, skewY: -10, skewX: -10 } },
            {
                pixi: { alpha: 1, scale: 1, pivotY: 100, skewY: 0, skewX: 0 },
                ease: 'elastic.out(1,0.4)',

                duration: 0.8,
                yoyo: true,
                repeat: 1
            }
        );
    }
}
