import Twenty48 from "./common/Twenty48.js";

let board = Twenty48.startBoard();
initialiseBoard(board);
updateBoard(board);

function initialiseBoard() {
    for (let r = 0; r < board.length; r++) {
        for(let c = 0; c < board[0].length; c++) {
            let tile = document.createElement("div");
            tile.id = `${r.toString()} ${c.toString()}`;
            document.getElementById("board").append(tile);
    }
}};

function updateBoard(board) {
    for (let r = 0; r < board.length; r++) {
        for(let c = 0; c < board[0].length; c++) {
            let value = board[r][c];
            let tile = document.getElementById(`${r.toString()} ${c.toString()}`);
            updateTile(tile, value);
    }
}};

function updateTile(tile, value) {
    tile.innerText = "";
    tile.classList.value = "";
    tile.classList.add("tile");
    if (value>0) {
        tile.innerText = value;
        tile.classList.add("x"+value.toString());
        }
    };

document.addEventListener("keydown", (e) => {
    if (Twenty48.cantMove(board)) {
        alert("Game Over!");
        board = Twenty48.startBoard();
    } else if (Twenty48.gameWin(board)) {
        alert("You Win!");
        board = Twenty48.startBoard();
    } else {
        board = Twenty48.doesKeyChangeBoard(board, e.code);
    }
    updateBoard(board);
});

