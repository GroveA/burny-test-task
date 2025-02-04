import gsap from 'gsap';

export default class PieceAnimations {
    static setScore(text, score) {
        gsap.to(text.score, {
            value: score,
            duration: 0.5,
            onUpdate: () => {
                text.scoreText.text = Math.round(text.score.value);
            }
            // ease: ''
        });
    }
}
