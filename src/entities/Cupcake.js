import { Assets, Sprite, Container } from 'pixi.js';
import FailAnimations from '../animations/FailAnimations';
export class Cupcake extends Container {
    constructor() {
        super();

        this.cupcake = new Sprite({ texture: Assets.get('cupcake'), anchor: 0.5 });

        this.redFill = new Sprite({ texture: Assets.get('redFill'), anchor: 0.5 });
        this.addChild(this.redFill);
        this.addChild(this.cupcake);

        this.redFill.alpha = 0;
    }

    blinkRed() {
        FailAnimations.blinkRed(this.redFill);
    }
}
