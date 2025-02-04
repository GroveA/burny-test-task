import { Assets, Container, Graphics, Sprite, BlurFilter } from 'pixi.js';
import { PieceView } from '../entities/PieceView';
import { Board } from '../entities/Board';
import { scaleToSize } from '../utils/scale';
import { PieceInputHandler } from '../entities/PieceInputHandler';
import { IqScoreText } from '../entities/IqScoreText';
import { signals } from '../entities/Signals';
import { Cupcake } from '../entities/Cupcake';
import gsap from 'gsap';
import { PopupText } from '../entities/PopupText';
import Banner from '../entities/Banner';
import { TutorialHand } from '../entities/TutorialHand';
import { sound } from '@pixi/sound';

export class LevelScene extends Container {
    constructor(parent, config) {
        super();

        parent.addChild(this);

        this.bg = new Sprite({ texture: Assets.get('bg'), anchor: 0.5 });

        this.addChild(this.bg);

        this.levelContainer = new Container();

        this.addChild(this.levelContainer);

        this.cupcake = new Cupcake(this.levelContainer);

        this.levelContainer.addChild(this.cupcake);

        this.banner = new Banner(this);

        this.iqScoreText = new IqScoreText(this.levelContainer);

        signals.onPiecePlaced.add((pieceName, isCorrect, piecesCount) => {
            this.iqScoreText.updateScore(piecesCount);

            if (this.checkIfWin()) {
                this.onGameWon();
            }
        });

        signals.onPieceRemoved.add((pieceName, piecesCount) => {
            this.iqScoreText.updateScore(piecesCount);
        });

        this.board = new Board(config);

        this.puzzlePieces = [];

        this.pieceContainer = new Container();
        this.pieceContainer.sortableChildren = true;

        this.levelContainer.addChild(this.pieceContainer);

        ['figure1', 'figure2', 'figure3', 'figure4', 'figure5', 'figure6'].forEach((pieceName, index) => {
            const pieceView = new PieceView(this.pieceContainer, pieceName);

            const pieceInputHandler = new PieceInputHandler(
                pieceName,
                pieceView,
                config.pieces[pieceName].startPosition,
                parent,
                this.board
            );

            this.puzzlePieces.push(pieceInputHandler);
        });

        this.tutorialHand = new TutorialHand(this.levelContainer, this.puzzlePieces, this.board);

        this.popupText = new PopupText(this.levelContainer);

        this.createFailScenario();
    }

    checkIfWin() {
        if (this.puzzlePieces.length === this.board.pieces.size) {
            for (let value of this.board.pieces.values()) {
                if (!value) return false;
            }

            return true;
        }
        return false;
    }

    onGameWon() {
        this.pieceContainer.eventMode = 'none';
        this.popupText.showSuccess();
        sound.play('wellDone');

        gsap.to(
            {},
            {
                duration: 1,
                onComplete: () => {
                    signals.onGameFinish.dispatch();
                }
            }
        );
    }

    createFailScenario() {
        this.hasFailed = false;

        this.replaceFigure('figure5', 'figure7');

        const onLastPiecePlaced = () => {
            this.hasFailed = true;

            this.tutorialHand.stop();

            const tl = gsap.timeline();

            tl.to(
                {},
                {
                    duration: 1,
                    onComplete: () => {
                        this.pieceContainer.eventMode = 'none';

                        this.cupcake.blinkRed();
                    }
                }
            );
            tl.to(
                {},
                {
                    duration: 1,
                    onComplete: () => {
                        this.popupText.showFail();
                    }
                }
            );
            tl.to(
                {},
                {
                    duration: 0.5
                }
            );
            this.puzzlePieces.forEach((piece, i) => {
                tl.to(
                    {},
                    {
                        duration: i * 0.01,
                        onComplete: () => {
                            piece.reset();
                        }
                    }
                );
            });

            tl.to(
                {},
                {
                    duration: 0.3,
                    onComplete: () => {
                        this.replaceFigure('figure7', 'figure5');

                        this.pieceContainer.eventMode = 'passive';

                        this.tutorialHand.start();
                    }
                }
            );
        };

        signals.onPiecePlaced.add((pieceName, isCorrect, piecesCount) => {
            if (this.hasFailed) {
                return;
            }

            const remainingPieces = this.puzzlePieces.filter(
                (piece) => piece.isStarted && !this.board.pieces.has(piece.pieceId)
            );

            if (remainingPieces.every((piece) => !this.board.findClosestPosition(piece.pieceId, 0, 0, 600))) {
                onLastPiecePlaced();
            }
        });
    }

    replaceFigure(replaceablePiece, newPiece) {
        const replaceablePieceIndex = this.puzzlePieces.findIndex(
            (piece) => piece.pieceId === replaceablePiece
        );

        this.puzzlePieces[replaceablePieceIndex].set(newPiece);
    }

    update(dt) {
        this.tutorialHand.update(dt);
    }

    resize(width, height, scale) {
        this.x = width / 2;
        this.y = height / 2;
        this.scale.set(scale);

        scaleToSize(this.bg, width / scale, height / scale, false);

        scaleToSize(this.levelContainer, 500, 500, false);

        if (width > height) {
            scaleToSize(this.banner, 450, 450, true);

            this.banner.x = -width / scale / 2 + this.banner.width / 2 + 0;

            this.banner.y = -height / scale / 2 + this.banner.height / 2 - 25;

            this.iqScoreText.y = -400;

            this.iqScoreText.scale.set(1.25);

            this.levelContainer.x = 100;
        } else {
            scaleToSize(this.banner, width / scale - 150, height / scale - 150, true);

            this.banner.x = 0;

            this.banner.y = -height / scale / 2 + 100;

            this.iqScoreText.y = -450;

            this.iqScoreText.scale.set(1.5);
            this.levelContainer.x = 0;
        }
    }
}
