import { GameEngine } from './utils/GameEngine';
import * as FontAssets from './assets/FontAssets';
import * as GameAssets from './assets/GameAssets';
import * as EndcardAssets from './assets/EndcardAssets';
import * as SoundAssets from './assets/SoundAssets';
import { Assets } from 'pixi.js';
import { LevelScene } from './scenes/LevelScene';
import level1Config from './configs/Level1';
import { sound } from '@pixi/sound';
import { EndcardScene } from './scenes/EndcardScene';
import { signals } from './entities/Signals';

export class Game extends GameEngine {
    constructor(width, height) {
        super();

        this.boot({ width, height, backgroundColor: 0x000000 });
    }

    async load() {
        for (let assetName in GameAssets) {
            Assets.add({ alias: assetName, src: GameAssets[assetName] });
            await Assets.load(assetName);
        }
        for (let assetName in EndcardAssets) {
            const alias = `endcard/${assetName}`;
            Assets.add({ alias: alias, src: EndcardAssets[assetName] });
            await Assets.load(alias);
        }

        for (let assetName in SoundAssets) {
            sound.add(assetName, SoundAssets[assetName]);
        }

        const fontFaces = Object.entries(FontAssets).map(([name, src]) => new FontFace(name, `url(${src})`));

        await Promise.all(fontFaces.map((font) => font.load()));

        fontFaces.forEach((font) => document.fonts.add(font));
    }

    async create() {
        this.app.stage.eventMode = 'static';
        this.app.stage.hitArea = this.app.screen;

        sound.play('backgroundMusic', { loop: true });

        this.levelScene = new LevelScene(this.app.stage, level1Config);

        this.endcardScene = new EndcardScene(this.app.stage);

        signals.onGameFinish.addOnce(() => {
            this.endcardScene.show();
        });
    }

    update(dt) {
        this.levelScene.update(dt);
    }

    resize(width, height, scale) {
        this.levelScene.resize(width, height, scale);
        this.endcardScene.resize(width, height, scale);
    }
}
