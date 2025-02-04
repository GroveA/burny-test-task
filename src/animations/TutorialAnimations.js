import gsap from 'gsap';

export default class PieceAnimations {
    static showTutorial(tutorial, piece) {
        const tl = gsap.timeline();

        tutorial.isShowing = true;
        tl.fromTo(
            tutorial.hand,
            {
                pixi: {
                    alpha: 0,
                    scale: 1.25,
                    pivotX: -100,
                    pivotY: -100
                }
            },
            {
                pixi: {
                    scale: 1,
                    alpha: 1,
                    pivotX: 0,
                    pivotY: 0
                },
                duration: 0.5
            }
        );

        tl.to(piece.sprite, {
            pixi: {
                scale: 1.25
            },

            duration: 0.1,
            yoyo: true,
            repeat: 1
        });
        tl.to(
            tutorial.hand,
            {
                pixi: {
                    scale: 0.9
                },
                duration: 0.2
            },
            '<'
        );
        tl.to(
            piece.sprite,
            {
                pixi: {
                    x: (tutorial.piece.x - piece.x) / 2,
                    y: (tutorial.piece.y - piece.y) / 2
                },

                duration: 1,
                ease: 'sine.inOut'
            },
            '-=0.1'
        );
        tl.to(
            tutorial.hand,
            {
                pixi: {
                    x: tutorial.piece.x,
                    y: tutorial.piece.y
                },
                duration: 1,
                ease: 'sine.inOut'
            },
            '<'
        );

        tl.to(
            tutorial.hand,
            {
                pixi: {
                    alpha: 0
                },
                duration: 0.25
            },
            '-=0.5'
        );
        tl.to(
            piece.sprite,
            {
                pixi: {
                    x: 0,
                    y: 0
                },
                duration: 0.5
            },
            '-=0.5'
        );

        tl.eventCallback('onComplete', () => {
            tutorial.isShowing = false;
        });

        return tl;
    }
}
