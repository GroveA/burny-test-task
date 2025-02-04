import gsap from 'gsap';

export default class FailAnimations {
    static blinkRed(redFill) {
        gsap.fromTo(
            redFill,
            {
                pixi: {
                    scale: 0.8,
                    alpha: 0
                }
            },
            {
                pixi: {
                    scale: 1,
                    alpha: 1
                },
                duration: 0.2,
                ease: 'power2.inOut',
                repeat: 5,
                yoyo: true
            }
        );
    }
}
