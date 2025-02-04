import { Assets, Container, Sprite, Text } from 'pixi.js';
import { textStyles } from '../configs/TextStyles';

export default class Banner extends Container {
    constructor(parent) {
        super();

        this.bg = new Sprite({ texture: Assets.get('plashka'), anchor: 0.5 });
        this.bg.scale.y = 1.5;
        this.text = new Text({
            text: 'Fill up the pancake for IQ 120+',
            style: textStyles.bannerText,
            anchor: 0.5,
            y: -10
        });

        this.addChild(this.bg, this.text);

        parent.addChild(this);
    }
}
