import { Assets, Container, Sprite } from 'pixi.js';
import TutorialAnimations from '../animations/TutorialAnimations';
export class TutorialHand extends Container {
    constructor(parent, pieces, board) {
        super();

        this.pieces = pieces;
        this.board = board;

        this.hand = new Sprite({ texture: Assets.get('hand') });

        this.piece = new Sprite({ texture: Assets.get('figure1') });
        this.piece.tint = 0x000000;
        this.piece.alpha = 0.0;
        this.piece.anchor.set(0.5);

        this.addChild(this.piece, this.hand);

        parent.addChild(this);

        this.nextPiece = 0;

        this.tutorialDelay = 0;

        this.tutorialInterval = 1000;

        this.isShowing = false;

        this.isStarted = true;

        this.hide();
    }

    start() {
        this.tutorialDelay = 0;

        this.isStarted = true;
    }

    stop() {
        this.isStarted = false;
    }

    show() {
        this.hand.visible = true;

        const tutorialPiece = this.getPiece();

        if (tutorialPiece) {
            const correctBoardTile = this.board.getCorrectTile(tutorialPiece.pieceId);
            const pieceTile = this.board.getPieceTile(tutorialPiece.pieceId);

            if (correctBoardTile && pieceTile) {
                const piecePosition = this.board.getPiecePosition(
                    tutorialPiece.pieceId,
                    correctBoardTile.row,
                    correctBoardTile.col,
                    pieceTile.row,
                    pieceTile.col
                );

                this.piece.position.set(piecePosition.x, piecePosition.y);

                const handPosition = this.getHandPosition(tutorialPiece);

                this.hand.position.set(handPosition.x, handPosition.y);

                this.piece.visible = true;

                this.tutorialAnimation = TutorialAnimations.showTutorial(this, tutorialPiece.piece);
            }
        }
    }

    hide() {
        this.hand.visible = false;
        this.piece.visible = false;

        if (this.tutorialAnimation) {
            this.tutorialAnimation.progress(1);
            this.tutorialAnimation = null;
        }
    }

    update(delta) {
        if (!this.isStarted) return;

        if (this.pieces.some((p) => p.isDragging)) {
            this.tutorialDelay = 0;
            if (this.isShowing) {
                this.hide();
            }
            return;
        }

        if (this.isShowing) return;

        this.tutorialDelay += delta;

        if (this.tutorialDelay > this.tutorialInterval) {
            this.tutorialDelay = 0;

            this.show();
        }
    }

    getHandPosition(pieceInputHandler) {
        const piece = pieceInputHandler.piece;

        return {
            x: piece.x + piece.sprite.x,
            y: piece.y + piece.sprite.y
        };
    }

    getPiece() {
        for (let i = this.nextPiece; i < this.pieces.length + this.nextPiece; i++) {
            const piece = this.pieces[i % this.pieces.length];

            if (this.board.pieces.has(piece.pieceId)) continue;

            const correctTile = this.board.getCorrectTile(piece.pieceId);

            if (this.board.canPlacePiece(piece.pieceId, correctTile.row, correctTile.column)) {
                this.nextPiece = i + 1;
                return piece;
            }
        }

        return null;
    }
}
