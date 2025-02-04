export default {
    tileSize: { width: 57, height: 58 },
    spacing: { row: 3, column: 2 },

    board: {
        startOffset: { x: 1 + 57, y: 0 },

        rows: 8,
        columns: 6,

        px: -256,
        py: -256,

        tiles: [
            [0, 0, 0, 1, 0, 0],
            [0, 1, 1, 1, 1, 0],
            [0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1],
            [0, 1, 1, 1, 1, 1]
        ]
    },
    pieces: {
        figure1: {
            correctTile: { row: 0, column: 3 },

            startPosition: { x: -275, y: -200 },

            startOffset: { x: 0, y: -2 },

            rows: 2,
            columns: 3,

            px: -175 / 2,
            py: -122 / 2,
            tiles: [
                [0, 0, 1],
                [1, 1, 1]
            ]
        },
        figure2: {
            correctTile: { row: 5, column: 0 },

            startPosition: { x: 300, y: 50 },

            startOffset: { x: 0, y: 1 },

            rows: 3,
            columns: 3,

            px: -175 / 2,
            py: -185 / 2,
            tiles: [
                [1, 1, 1],
                [1, 1, 1],
                [0, 1, 1]
            ]
        },
        figure3: {
            correctTile: { row: 1, column: 4 },

            startPosition: { x: -330, y: 50 },

            startOffset: { x: 0, y: 5 },

            rows: 3,
            columns: 2,

            px: -116 / 2,
            py: -189 / 2,
            tiles: [
                [1, 0],
                [1, 1],
                [0, 1]
            ]
        },

        figure4: {
            correctTile: { row: 2, column: 1 },

            startPosition: { x: 200, y: 300 },

            startOffset: { x: 0, y: 0 },

            rows: 3,
            columns: 3,

            px: -175 / 2,
            py: -186 / 2,
            tiles: [
                [0, 1, 0],
                [1, 1, 1],
                [1, 1, 1]
            ]
        },
        figure5: {
            correctTile: { row: 2, column: 2 },

            startPosition: { x: -200, y: 300 },

            startOffset: { x: 0, y: 0 },

            rows: 3,
            columns: 4,

            px: -235 / 2,
            py: -185 / 2,
            tiles: [
                [1, 1, 0, 0],
                [0, 1, 1, 0],
                [0, 1, 1, 1]
            ]
        },
        figure6: {
            correctTile: { row: 6, column: 4 },

            startPosition: { x: 275, y: -200 },

            startOffset: { x: 1, y: 2 },

            rows: 3,
            columns: 3,

            px: -177 / 2,
            py: -185 / 2,
            tiles: [
                [1, 1, 1],
                [1, 1, 1],
                [1, 1, 1]
            ]
        },
        figure7: {
            correctTile: { row: -1, column: -1 },

            startPosition: { x: -200, y: 325 },

            startOffset: { x: 1, y: 1 },

            rows: 2,
            columns: 3,

            px: -174 / 2,
            py: -125 / 2,
            tiles: [
                [1, 0, 1],
                [1, 1, 1]
            ]
        }
    }
};
