import { Assets, Container, Sprite, Text } from 'pixi.js';
import { scaleToSize } from '../utils/scale';
import { textStyles } from '../configs/TextStyles';
import EndcardAnimations from '../animations/EndcardAnimations';
import { SDK } from '../SDK';
import { sound } from '@pixi/sound';

export class EndcardScene extends Container {
    constructor(parent) {
        super();

        parent.addChild(this);

        this.bg = new Sprite({ texture: Assets.get('bg'), anchor: 0.5 });

        this.tiles = new Sprite({ texture: Assets.get('endcard/tiles'), anchor: { x: 0.5, y: 1 }, y: 100 });

        this.logo = new Sprite({ texture: Assets.get('endcard/logo'), anchor: 0.5, y: -100 });
        scaleToSize(this.logo, 500, 500, true);

        this.btn = new Container({ y: 100 });
        this.btn.addChild(new Sprite({ texture: Assets.get('endcard/btn'), anchor: 0.5 }));
        this.btn.addChild(
            new Text({ text: 'Play now', style: textStyles.endcardBtnText, anchor: 0.5, y: -25 })
        );
        scaleToSize(this.btn, 550, 550, true);

        this.addChild(this.bg, this.tiles);

        this.figures = ['figure4', 'figure1', 'figure5', 'figure2'].map((figureTexture, index) => {
            const figure = new Sprite({
                texture: Assets.get(`endcard/${figureTexture}`),
                anchor: 0.5,
                pivot: {
                    x: -100 + 200 * Math.floor(index / 2),
                    y: -150 + 300 * ((index + 1) % 2)
                }
            });

            this.addChild(figure);

            return figure;
        });

        this.addChild(this.logo, this.btn);

        this.btn.eventMode = 'static';
        this.btn.on('pointerdown', () => {
            EndcardAnimations.clickBtn(this.btn);

            new SDK().openStore();
        });

        this.visible = false;
    }

    show() {
        this.visible = true;
        sound.play('finalScreen');

        EndcardAnimations.showEndcard(this);
        EndcardAnimations.showScale(this.btn);
        EndcardAnimations.showScale(this.logo);
        this.figures.forEach((figure, index) => {
            EndcardAnimations.showFigure(figure, index);
        });
    }

    resize(width, height, scale) {
        this.x = width / 2;
        this.y = height / 2;
        this.scale.set(scale);

        scaleToSize(this.bg, width / scale, height / scale, false);

        this.tiles.y = height / scale / 2;

        scaleToSize(this.tiles, width / scale, height / scale, false);

        this.figures.forEach((figure, index) => {
            figure.x = -width / scale / 2 + (width / scale) * Math.floor(index / 2);

            figure.y = -height / scale / 2 + (height / scale) * ((index + 1) % 2);
        });
    }
}
