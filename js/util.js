'use strict'

document.addEventListener('contextmenu', e => {
    e.preventDefault()
})

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

    // board[0][1].isMine = true
    // board[3][0].isMine = true
    // board[1][2].isMine = true

    var locations = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            locations.push({ i, j })
        }
    }

    for (var i = 0; i < gLevel.MINES; i++) {
        var randIdx = getRandomIntInclusive(0, locations.length - 1)
        var currLocation = locations[randIdx]
        locations.splice(randIdx, 1)
        board[currLocation.i][currLocation.j].isMine = true
    }
    return board
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

