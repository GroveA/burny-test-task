import gsap from 'gsap';

export default class EndcardAnimations {
    static showEndcard(obj) {
        gsap.fromTo(obj, { pixi: { alpha: 0 } }, { pixi: { alpha: 1 }, duration: 0.5 });
    }
    static showScale(obj) {
        gsap.fromTo(
            obj,
            { pixi: { scaleX: 0, scaleY: 0 } },
            { pixi: { scaleX: obj.scale.x, scaleY: obj.scale.y }, duration: 2, ease: 'elastic.out(1,0.4)' }
        );
    }

    static showFigure(figure, index) {
        gsap.fromTo(
            figure,
            { pixi: { scaleX: 0, scaleY: 0 } },
            {
                pixi: { scaleX: figure.scale.x * 1, scaleY: figure.scale.y * 1 },
                duration: 2,
                delay: index * 0.05,
                ease: 'elastic.out(1,0.4)'
            }
        );
    }

    static clickBtn(btn) {
        gsap.to(btn, {
            pixi: { scale: 0.55 },
            yoyo: true,
            repeat: 1,
            duration: 0.1,
            ease: 'sine.inOut'
        });
    }
}
