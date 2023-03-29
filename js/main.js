'use strict'

const MINE = '💣'
const FLAG = '🚩'


var gBoard

var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}




gBoard = buildBoard()
renderBoard(gBoard)
setMinesNegsCount(gBoard)




function onInit() {


}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            if (board[i][j].isMine) continue
            var negsCount = minesNegsCountInCell(i, j, board)
            board[i][j].minesAroundCount = negsCount

            // if (negsCount !== 0) {
            //     const elCell = document.querySelector(`.cell-${i}-${j}`)
            //     elCell.innerHTML = negsCount
            // }
        }
    }
}


function minesNegsCountInCell(rowIdx, colIdx, board) {
    var negsCount = 0

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board.length) continue
            if (i === rowIdx && j === colIdx) continue
            if (board[i][j].isMine) negsCount++

        }
    }
    return negsCount

}

function renderBoard(board) {
    console.log(board)
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            const className = `cell-${i}-${j}`
            strHTML += `<td onclick="onCellClicked(this, ${i}, ${j})" class="${className}">`

            if (currCell.isMine) {
                //strHTML += MINE
            }

            strHTML += '</td>'
        }
        strHTML += '</tr>\n'
    }
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function onCellClicked(elCell, i, j) {
    var value
    if (gBoard[i][j].minesAroundCount === 0) {
        elCell.classList.add('empty-cell')
        gBoard[i][j].isShown = true
        expandShown(gBoard, elCell, i, j) //TODO class of empty, open negs cells
        return
    }
    if (gBoard[i][j].isMine) value = MINE // TODO  game over
    else {
        value = gBoard[i][j].minesAroundCount
        gBoard[i][j].isShown = true
    }


    elCell = document.querySelector(`.cell-${i}-${j}`)
    elCell.innerHTML = value
}

function onCellMarked(elCell) {

}

function checkGameOver() {

}

function expandShown(board, elCell, rowIdx, colIdx) {
    var value
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board.length) continue
            if (i === rowIdx && j === colIdx) continue

            value = board[i][j].minesAroundCount
            elCell = document.querySelector(`.cell-${i}-${j}`)

            if (value === 0) {
                if (gBoard[i][j].isShown) continue
                elCell.classList.add('empty-cell')
                expandShown(board, elCell, i, j)
            } else elCell.innerHTML = value
        }
    }
}

// function renderCell(location, value) {
//     const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
//     elCell.innerHTML = value
// }

