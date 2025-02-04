import { signals } from './Signals';

export class Board {
    constructor(levelConfig) {
        this.levelConfig = levelConfig;

        this.boardTiles = [];
        this.pieceTiles = {};

        this.pieces = new Map();

        this.generateTiles();
    }

    generateTiles() {
        this._createBoardTiles();

        for (const pieceName in this.levelConfig.pieces) {
            this._createPieceTiles(pieceName);
        }
    }

    _createBoardTiles() {
        const { board, tileSize, spacing } = this.levelConfig;

        this.boardTiles = [];

        for (let x = 0; x < board.rows; x++) {
            const row = [];

            for (let y = 0; y < board.columns; y++) {
                if (board.tiles[x][y] === 1) {
                    row.push({
                        x: board.px + y * (tileSize.width + spacing.column) + board.startOffset.x,
                        y: board.py + x * (tileSize.height + spacing.row) + board.startOffset.y,
                        occupied: false,
                        piece: null
                    });
                } else {
                    row.push(false);
                }
            }

            this.boardTiles.push(row);
        }
    }

    _createPieceTiles(pieceName) {
        this.pieceTiles[pieceName] = [];
        const { pieces, tileSize, spacing } = this.levelConfig;

        const pieceConfig = pieces[pieceName];
        for (let x = 0; x < pieceConfig.rows; x++) {
            const row = [];

            for (let y = 0; y < pieceConfig.columns; y++) {
                if (pieceConfig.tiles[x][y] === 1) {
                    row.push({
                        x: pieceConfig.px + y * (tileSize.width + spacing.column) + pieceConfig.startOffset.x,
                        y: pieceConfig.py + x * (tileSize.height + spacing.row) + pieceConfig.startOffset.y
                    });
                } else {
                    row.push(false);
                }
            }

            this.pieceTiles[pieceName].push(row);
        }
    }

    // drawDebugBoard() {
    //     const debugGraphics = new Graphics();

    //     debugGraphics.eventMode = 'none';

    //     this.addChild(debugGraphics);

    //     const { board, tileSize, spacing } = levelConfig;

    //     const draw = () => {
    //         debugGraphics.clear();
    //         for (let x = 0; x < board.rows; x++) {
    //             for (let y = 0; y < board.columns; y++) {
    //                 debugGraphics
    //                     .rect(
    //                         board.px + y * (tileSize.width + spacing.column) + board.startOffset.x,
    //                         board.py + x * (tileSize.height + spacing.row) + board.startOffset.y,
    //                         tileSize.width,
    //                         tileSize.height
    //                     )
    //                     .fill({
    //                         color:
    //                             board.tiles[x][y] === 1
    //                                 ? this.boardTiles[x][y] && !this.boardTiles[x][y].occupied
    //                                     ? 0xffffff
    //                                     : 0xff0000
    //                                 : 0x000000,
    //                         alpha: 0.2
    //                     });
    //             }
    //         }
    //     };

    //     draw();

    //     return draw;
    // }

    // drawDebugPiece(piece) {
    //     const debugGraphics = new Graphics();

    //     debugGraphics.eventMode = 'none';

    //     piece.addChild(debugGraphics);

    //     const { pieces, tileSize, spacing } = levelConfig;

    //     const pieceConfig = pieces[piece.name];

    //     for (let x = 0; x < pieceConfig.rows; x++) {
    //         for (let y = 0; y < pieceConfig.columns; y++) {
    //             debugGraphics
    //                 .rect(
    //                     pieceConfig.px + y * (tileSize.width + spacing.column) + pieceConfig.startOffset.x,
    //                     pieceConfig.py + x * (tileSize.height + spacing.row) + pieceConfig.startOffset.y,
    //                     tileSize.width,
    //                     tileSize.height
    //                 )
    //                 .fill({ color: pieceConfig.tiles[x][y] === 1 ? 0xffffff : 0x000000, alpha: 0.2 });
    //         }
    //     }
    // }

    getCorrectTile(pieceName) {
        const pieceConfig = this.levelConfig.pieces[pieceName];
        const correctTile = pieceConfig.correctTile;

        if (
            correctTile.row < 0 ||
            correctTile.column < 0 ||
            correctTile.row >= this.boardTiles.length ||
            correctTile.column >= this.boardTiles[correctTile.row].length
        ) {
            return false;
        }

        return {
            tile: this.boardTiles[correctTile.row][correctTile.column],
            row: correctTile.row,
            col: correctTile.column
        };
    }

    placePiece(pieceName, position) {
        const pieceShape = this.pieceTiles[pieceName];
        const pieceConfig = this.levelConfig.pieces[pieceName];
        const correctTile = pieceConfig.correctTile;
        const { startRow, startCol } = position;

        let isCorrect = false;

        for (let pieceRow = 0; pieceRow < pieceShape.length; pieceRow++) {
            for (let pieceCol = 0; pieceCol < pieceShape[pieceRow].length; pieceCol++) {
                const pieceTile = pieceShape[pieceRow][pieceCol];
                if (pieceTile) {
                    const boardRow = startRow + pieceRow;
                    const boardCol = startCol + pieceCol;

                    if (boardRow === correctTile.row && boardCol === correctTile.column) {
                        isCorrect = true;
                    }

                    if (
                        boardRow >= 0 &&
                        boardRow < this.boardTiles.length &&
                        boardCol >= 0 &&
                        boardCol < this.boardTiles[boardRow].length
                    ) {
                        const boardTile = this.boardTiles[boardRow][boardCol];
                        if (boardTile) {
                            boardTile.occupied = true;
                            boardTile.piece = pieceName;
                        }
                    }
                }
            }
        }

        this.pieces.set(pieceName, isCorrect);

        signals.onPiecePlaced.dispatch(pieceName, isCorrect, this.pieces.size);
    }

    removePiece(pieceName) {
        if (!this.pieces.has(pieceName)) return;

        for (let row = 0; row < this.boardTiles.length; row++) {
            for (let col = 0; col < this.boardTiles[row].length; col++) {
                const tile = this.boardTiles[row][col];
                if (tile && tile.piece === pieceName) {
                    tile.occupied = false;
                    tile.piece = null;
                }
            }
        }
        this.pieces.delete(pieceName);

        signals.onPieceRemoved.dispatch(pieceName, this.pieces.size);
    }

    canPlacePiece(pieceName, startRow, startCol) {
        const pieceShape = this.pieceTiles[pieceName];
        let canPlace = true;

        const endRow = startRow + pieceShape.length;
        const endCol = startCol + pieceShape[0].length;

        for (let boardRow = startRow; boardRow < endRow; boardRow++) {
            for (let boardCol = startCol; boardCol < endCol; boardCol++) {
                const pieceRow = boardRow - startRow;
                const pieceCol = boardCol - startCol;

                if (pieceShape[pieceRow][pieceCol]) {
                    if (
                        boardRow < 0 ||
                        boardCol < 0 ||
                        boardRow >= this.boardTiles.length ||
                        boardCol >= this.boardTiles[boardRow].length
                    ) {
                        return false;
                    }
                    if (
                        !this.boardTiles[boardRow][boardCol] ||
                        this.boardTiles[boardRow][boardCol].occupied
                    ) {
                        return false;
                    }
                }
            }
        }

        return canPlace;
    }

    getPiecePosition(pieceName, boardRow, boardCol, pieceRow, pieceCol) {
        const pieceShape = this.pieceTiles[pieceName];
        const tile = this.boardTiles[boardRow][boardCol];

        const pieceTile = pieceShape[pieceRow][pieceCol];

        return {
            x: tile.x - pieceTile.x,
            y: tile.y - pieceTile.y
        };
    }

    getPieceTile(pieceName) {
        const pieceShape = this.pieceTiles[pieceName];

        for (let pieceRow = 0; pieceRow < pieceShape.length; pieceRow++) {
            for (let pieceCol = 0; pieceCol < pieceShape[pieceRow].length; pieceCol++) {
                const pieceTile = pieceShape[pieceRow][pieceCol];

                if (pieceTile) {
                    return { tile: pieceTile, row: pieceRow, col: pieceCol };
                }
            }
        }

        return null;
    }

    findClosestPosition(pieceName, x, y, maxSnappingDistance = 40) {
        const pieceShape = this.pieceTiles[pieceName];

        const calculateDistance = (x1, y1, x2, y2) => Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);

        const possibleTiles = [];

        for (let row = 0; row < this.boardTiles.length; row++) {
            for (let col = 0; col < this.boardTiles[row].length; col++) {
                const tile = this.boardTiles[row][col];

                if (!tile || tile.occupied) continue;

                const pieceTile = this.getPieceTile(pieceName);

                if (pieceTile) {
                    const pX = pieceTile.tile.x + x;
                    const pY = pieceTile.tile.y + y;

                    const distance = calculateDistance(pX, pY, tile.x, tile.y);
                    if (distance < maxSnappingDistance) {
                        possibleTiles.push({
                            row,
                            col,
                            pieceRow: pieceTile.row,
                            pieceCol: pieceTile.col,
                            distance
                        });
                    }
                }
            }
        }

        possibleTiles.sort((a, b) => a.distance - b.distance);

        for (let i = 0; i < possibleTiles.length; i++) {
            const possibleTile = possibleTiles[i];

            const startRow = possibleTile.row - possibleTile.pieceRow;
            const startCol = possibleTile.col - possibleTile.pieceCol;

            const canPlace = this.canPlacePiece(pieceName, startRow, startCol);

            if (canPlace) {
                const tile = this.boardTiles[possibleTile.row][possibleTile.col];

                const pieceTile = pieceShape[possibleTile.pieceRow][possibleTile.pieceCol];

                return {
                    startRow: startRow,
                    startCol: startCol,
                    position: this.getPiecePosition(
                        pieceName,
                        possibleTile.row,
                        possibleTile.col,
                        possibleTile.pieceRow,
                        possibleTile.pieceCol
                    )
                };
            }
        }

        return null;
    }
}
