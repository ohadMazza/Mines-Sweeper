'use strict'

function buildBoard() {

    const board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: null,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    // setting a manually mines
    board[0][1].isMine = true
    board[0][2].isMine = true
    board[2][2].isMine = true

    return board
}