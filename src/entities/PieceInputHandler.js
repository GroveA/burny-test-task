import { sound } from '@pixi/sound';
import PieceAnimations from '../animations/PieceAnimations';

export class PieceInputHandler {
    constructor(pieceId, piece, startPosition, stage, board) {
        this.pieceId = pieceId;

        this.startPosition = startPosition;

        this.piece = piece;

        this.stage = stage;

        this.board = board;

        this.piece.position.set(startPosition.x, startPosition.y);

        this.isDragging = false;

        this.isStarted = false;

        this.start();
    }

    start() {
        if (this.isStarted) return;

        this.isStarted = true;

        this.piece.visible = true;

        this.piece.sprite.eventMode = 'static';

        this.piece.sprite.on('pointerdown', this.onDragStart, this);

        this.stage.on('pointerup', this.onDragEnd, this);
    }

    set(pieceId) {
        this.pieceId = pieceId;
        this.piece.setTexture(pieceId);
    }

    stop() {
        if (!this.isStarted) return;

        this.isStarted = false;

        this.piece.visible = false;

        this.piece.sprite.eventMode = 'none';

        this.isDragging = false;

        this.piece.sprite.off('pointerdown', this.onDragStart, this);

        this.stage.off('pointerup', this.onDragEnd, this);
    }

    onDragStart(event) {
        this.isDragging = true;

        console.log('onDragStart', this.pieceId);

        this.piece.renderOrderTop();

        this.board.removePiece(this.pieceId);

        PieceAnimations.pieceDragStart(this.piece, event.global);

        this.stage.on('pointermove', this.onDragMove, this);
    }

    onDragMove(event) {
        if (this.isDragging) {
            this.piece.sprite.parent.toLocal(event.global, null, this.piece.sprite.position);
        }
    }

    onDragEnd() {
        if (this.isDragging) {
            const position = this.piece.parent.toLocal(this.piece.sprite.position, this.piece);

            const snapped = this.board.findClosestPosition(this.pieceId, position.x, position.y);

            if (snapped) {
                const snappedPosition = this.piece.sprite.parent.toLocal(
                    snapped.position,
                    this.piece.parent
                    // this.piece.sprite.position
                );
                this.board.placePiece(this.pieceId, snapped);
                sound.play('placeFigure');

                PieceAnimations.pieceSnapped(this.piece, snappedPosition.x, snappedPosition.y);
            } else {
                this.reset();
            }

            this.stage.off('pointermove', this.onDragMove, this);
        }

        this.piece.renderOrderReset();

        this.isDragging = false;
    }

    reset() {
        PieceAnimations.pieceReturn(this.piece);
        this.board.removePiece(this.pieceId);
        this.piece.renderOrderReset();
    }
}
