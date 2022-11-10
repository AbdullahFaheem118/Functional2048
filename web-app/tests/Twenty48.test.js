import Twenty48 from "../common/Twenty48.js";
import R from "../common/ramda.js";

// testing if starting board is in a valid state
const throw_if_invalid = function (board) {
    // Rectangular array.
    if (!Array.isArray(board) || !Array.isArray(board[0])) {
        throw new Error(
            "The board is not a 2D array"
        );
    }
    const width = board[0].length;
    const rectangular = R.all(
        (row) => row.length === width,
        board
    );
    if (!rectangular) {
        throw new Error(
            "The board is not rectangular"
        );
    }

    // Only valid numbers
    const token_or_empty = [0, 2, 4, 8, 16, 32, 64, 128, 256, 1024, 2048];
    const contains_valid_tokens = R.pipe(
        R.flatten,
        R.all((slot) => token_or_empty.includes(slot))
    )(board);
    if (!contains_valid_tokens) {
        throw new Error(
            "The board contains invalid numbers"
        );
    }
};


describe("Starting Board", function () {
    it("A starting board is a valid board", function () {
        const start_board = Twenty48.startBoard();
        throw_if_invalid(start_board);
    });

    it("A start board is not a game win.", function () {
        const start_board = Twenty48.startBoard();
        if (Twenty48.gameWin(start_board)) {
            throw new Error(
                "An start board is not a game win"
            );
        }
    });

    it("A start board is not game over", function () {
        const start_board = Twenty48.startBoard();
        if (Twenty48.cantMove(start_board)) {
            throw new Error(
                "The start board should never be game over"
            );
        }
    });

    it("A start board has two tiles generated to begin", function () {
        const start_array = R.flatten(Twenty48.startBoard());
        const numberOfZero = R.length(R.filter((x) => x === 0, start_array));
        if (R.length(start_array) - numberOfZero !== 2) {
            throw new Error(
                "The correct number of starting tiles has not been generated"
            );
        }
    });
});



const throw_if_ended = function (mid_board) {
    if (Twenty48.cantMove(mid_board)) {
        throw new Error(
            "An playable board is being reported as ended"
        );
    }
};
const throw_if_won = function (mid_board) {
    if (Twenty48.gameWin(mid_board)) {
        throw new Error(
            "A playable board is being reported as game won"
        );
    }
};


describe("Middle boards", function () {
    it("A board with multiple possible moves", function () {
        const mid_boards = [
                [[0, 0, 0, 0], 
                [0, 0, 2, 0],
                [0, 0, 2, 0],
                [0, 0, 0, 0]],

                [[0, 8, 8, 16],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]],

                [[4, 4, 4, 4],
                [4, 4, 4, 4],
                [4, 4, 4, 4],
                [4, 4, 4, 4]]
            ];
        mid_boards.forEach(throw_if_ended);
    });

    it("A board with one possible move", function () {
        const mid_boards = [
                [[2, 8, 4, 4],
                [4, 2, 8, 2],
                [2, 4, 2, 4],
                [4, 2, 4, 2]],

                [[2, 4, 8, 16],
                [256, 128, 64, 32],
                [512, 1024, 16, 2],
                [4, 16, 4, 4]],

                [[64, 4, 2, 128],
                [4, 2, 32, 32],
                [2, 4, 2, 4],
                [512, 2, 1024, 2]]
            ];
        mid_boards.forEach(throw_if_ended);
    });

    it("A playable board that is close to a win", function () {
        const mid_boards = [
                [[2, 8, 4, 4],
                [4, 2, 8, 2],
                [2, 4, 2, 4],
                [4, 2, 1024, 1024]],

                [[1024, 1024, 1024, 1024],
                [1024, 1024, 1024, 1024],
                [1024, 1024, 1024, 1024],
                [1024, 1024, 1024, 1024]]
            ];
        mid_boards.forEach(throw_if_won);
    });

});


const throw_if_not_ended = function (end_board) {
    if (!Twenty48.cantMove(end_board)) {
        throw new Error(
            "An ended board is being reported as playable"
        );
    }
};
const throw_if_not_won = function (end_board) {
    if (!Twenty48.gameWin(end_board)) {
        throw new Error(
            "A won board is being reported as not won"
        );
    }
};



describe("Ended boards", function () {
    it("A board with no possible moves", function () {
        const ended_boards = [
                [[2, 4, 2, 4],
                [4, 2, 4, 2],
                [2, 4, 2, 4],
                [4, 2, 4, 2]],

                [[2, 4, 8, 16],
                [256, 128, 64, 32],
                [512, 1024, 16, 2],
                [4, 16, 8, 4]],

                [[64, 4, 2, 128],
                [4, 2, 32, 2],
                [2, 4, 2, 4],
                [512, 2, 1024, 2]]
            ];
        ended_boards.forEach(throw_if_not_ended);
    });

    it(
        `A board with 1024 should be ended as a win`,
        function () {
            const gameWins = [
                [[0, 0, 0, 0],
                [0, 0, 2048, 0],
                [0, 2, 0, 0],
                [0, 2, 0, 0]],

                [[2048, 0, 0, 0],
                [0, 0, 2048, 0],
                [0, 2, 0, 0],
                [0, 2, 0, 0]],

                [[2048, 2048, 2048, 2048],
                [2048, 2048, 2048, 2048],
                [2048, 2048, 2048, 2048],
                [2048, 2048, 2048, 2048]]
            ];
        gameWins.forEach(throw_if_not_won);
        });

});
