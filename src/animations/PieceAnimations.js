import gsap from 'gsap';

export default class PieceAnimations {
    static pieceDragStart(piece) {
        gsap.to(piece.sprite, {
            pixi: { scale: 0.9 },
            // scale: 1.1,
            yoyo: true,
            repeat: 1,
            duration: 0.1,
            ease: 'sine.inOut'
        });

        gsap.fromTo(
            piece.text,
            { pixi: { alpha: 1 } },
            { pixi: { alpha: 0 }, duration: 0.1, ease: 'sine.inOut' }
        );
    }
    static piecePlaced(piece) {}

    static pieceSnapped(piece, x, y) {
        gsap.to(piece.sprite, {
            pixi: { scale: 1, x, y },
            duration: 0.2,
            ease: 'sine.inOut'
        });
    }
    static pieceReturn(piece) {
        gsap.to(piece.sprite, {
            pixi: { scale: 1, x: 0, y: 0 },
            duration: 0.2,
            ease: 'sine.inOut',
            onComplete: () => {
                gsap.to(piece.text, {
                    pixi: { alpha: 1 },
                    duration: 0.2,
                    ease: 'sine.inOut'
                });
            }
        });
    }
}
