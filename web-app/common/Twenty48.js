import R from "./ramda.js";
/**
 * Twenty48.js is a module to model and play "2048" and related games.
 * @namespace Twenty48
 * @author Abdullah Faheem
 * @version 2022
 */
const Twenty48 = Object.create(null);

/**
 * Create a new empty board.
 * Optionally with a specified width and height,
 * otherwise returns a standard 4 wide, 4 high board.
 * @memberof Twenty48
 * @function
 * @param {number} [width = 4] The width of the new board.
 * @param {number} [height = 4] The height of the new board.
 */
Twenty48.startBoard = function (width = 4, height = 4) {
    return addRandomTile(addRandomTile(R.repeat(R.repeat(0, width), height)));
};

/**
 * Returns all the coordinates on the board where the value is 0
 * in the form of an array of arrays e.g. [[0,1],[3,1]...]
 * @memberof Twenty48
 * @function
 * @param {Twenty48.board} board The board to filter points
 * @returns {array} The coordinates of all the 0 tiles on the board
 */
const getZeroPoints = function (board) {
    return R.filter(function ([row, col]) {
        return board[row][col] === 0;
    }, getAllPoints(board));
};

/**
 * changes the value of a tile on the board
 * when the board, new value and index of the tile are inputted
 * the value of the tile is updated and the new board is returned
 * @memberof Twenty48
 * @function
 * @param {Twenty48.board} board The board to change value on
 * @param {number} value The new value
 * @param {array} coordinates The coordinates of tile to change
 * @returns {board} New board with the specified tile changed
 */
const changeTile = function (board, value, [row, col]) {
    return R.update(
        row,
        R.update(col, value, board[row]),
        board
    );
};

/**
 * after the player moves there is always at least one zero on the board
 * so the game is over if after all possible moves there are no zeroes on
 * the board
 * @memberof Twenty48
 * @function
 * @param {Twenty48.board} board The board to change value on
 * @returns {boolean} if the possible number of zeroes made by all moves is 0
 */
Twenty48.cantMove = function (board) {
    const possibleMoves = [
        slideLeft(board),
        slideRight(board),
        slideDown(board),
        slideUp(board)
    ];
    return R.sum(
        R.map(R.compose(R.length, getZeroPoints), possibleMoves)
    ) === 0;
};

/**
 * checks if player has won the game thorugh checking if 2048
 * is present on the board
 * @memberof Twenty48
 * @function
 * @param {Twenty48.board} board The board to inspect
 * @returns {boolean} True if player has won the game
 */
Twenty48.gameWin = function (board) {
    return R.length(R.filter((x) => x === 2048, R.flatten(board))) !== 0;
};

/**
 * checks if the move made by the player actually changes the state of the board
 * this is so we only generate a new tile if the state of the board changes
 * and we don't if the board remains the same
 * @memberof Twenty48
 * @function
 * @param {Twenty48.board} board The board to change value on
 * @param {string} keyCode The key code of the key the user has pressed
 * @returns {Twenty48.board} either returns new configuration of board
 * with the added tile or returns the same board
 */
Twenty48.doesKeyChangeBoard = function (board, keyCode) {
    const inputKeys = {
        "ArrowLeft": slideLeft,
        "ArrowRight": slideRight,
        "ArrowUp": slideUp,
        "ArrowDown": slideDown
    };
    if (R.includes(keyCode, Object.keys(inputKeys))) {
        let newBoard = inputKeys[keyCode](board);
        if (R.equals(board, newBoard)) {
            return board;
        } else {
            return addRandomTile(newBoard);
        }
    } else {
        return board;
    }
};

/**
 * Randomly picks a zero tile from
 * the board and makes it 2 or 4
 * @memberof Twenty48
 * @function
 * @param {Twenty48.board} board The board to generate tile on
 * @returns {Twenty48.board} Returns the same board  with random tile
 * generated
 */
const addRandomTile = function (board) {
    const pick = (arr) => arr[Math.floor((arr.length) * Math.random())];
    const newTileValue = pick(R.concat(R.repeat(2, 6), R.repeat(4, 1)));
    return changeTile(board, newTileValue, pick(getZeroPoints(board)));
};

const combineRow = function (row) {
    const addAdjacent = (row, index) => R.update(index, (row[index]) * 2, row);
    const replaceZero = (row, index) => R.update((index + 1), 0, row);
    row.forEach(function (value, index) {
        if (value === row[index + 1]) {
            row = replaceZero(addAdjacent(row, index), index);
        }
    });
    return row;
};
const slide = function (row) {
    const filterZero = (row) => R.filter((x) => x !== 0, row);
    let merge = filterZero(combineRow(filterZero(row)));
    return R.concat(merge, R.repeat(0, row.length-merge.length));
};

const getAllPoints = function (board) {
    const exampleRow = function (x) {
        return R.zip(R.repeat(x, board.length), R.range(0, board.length));
    };
    return R.unnest(R.map(exampleRow, R.range(0, board[0].length)));
};

const slideLeft = function (board) {
    return board.map(slide);
};
const slideRight = function (board) {
    return slideLeft(board.map(R.reverse)).map(R.reverse);
};
const slideUp = function (board) {
    return R.transpose(slideLeft(R.transpose(board)));
};
const slideDown = function (board) {
    return R.transpose(slideRight(R.transpose(board)));
};



export default Object.freeze(Twenty48);
