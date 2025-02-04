import { Application } from 'pixi.js';
import { getScale } from './scale';
import gsap from 'gsap';
import { PixiPlugin } from 'gsap/PixiPlugin';
import * as PIXI from 'pixi.js';

export class GameEngine {
    constructor() {
        this.app = new Application();
        gsap.registerPlugin(PixiPlugin);

        // gsap.ticker.s

        PixiPlugin.registerPIXI(PIXI);
    }

    async boot(applicationOptions) {
        this.app.init({ ...applicationOptions, autoStart: false, resizeTo: window }).then(() => {
            document.body.appendChild(this.app.canvas);
            this._load();
        });
    }

    _load() {
        this.load().then(() => {
            this._create();
        });
    }

    _create() {
        this.create().then(() => {
            this.app.renderer.on('resize', (width, height) => {
                this._resize(width, height);
            });

            this._resize(this.app.renderer.width, this.app.renderer.height);

            this.app.ticker.add(this._update.bind(this));

            this.app.start();
        });
    }

    _update() {
        // gsap.ticker.tick();

        this.update(this.app.ticker.deltaMS);
    }

    pause() {
        this.app.stop();
    }

    resume() {
        this.app.start();
    }

    _resize(width, height) {
        const scale = getScale(width, height);

        this.resize(width, height, scale);

        this.app.renderer.clear();
        this.app.render();
    }

    async load() {}
    async create() {}
    update() {}
    resize(width, height, scale) {}
}
