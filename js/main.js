'use strict'

const MINE = '💣'
const FLAG = '🚩'
const NORMAL = '🙂'
const LOSE = '🤯'
const WIN = '😎'
var LIVES = '❤❤❤'

var gBoard
var gTimer
var gIsFirstMove = true

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




// gBoard = buildBoard()
// renderBoard(gBoard)




function onInit() {
    gIsFirstMove = true
    gGame.isOn = true
    gGame.shownCount = 0
    gGame.markedCount = 0
    gBoard = buildBoard()
    renderBoard(gBoard)
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
            //var currCell = board[i][j]
            const className = `cell cell-${i}-${j}`
            strHTML += `<td onclick="onCellClicked(this, ${i}, ${j})" class="${className}"
             oncontextmenu="onCellMarked(this, ${i}, ${j}); return false">`
            strHTML += '</td>'
        }
        strHTML += '</tr>\n'
    }
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function onCellClicked(elCell, i, j) {
    if (!gGame.isOn) return
    if (gIsFirstMove) {
        startTimer()
        gIsFirstMove = false
        setMinesOnBoardByClick(i, j)
        setMinesNegsCount(gBoard)
        console.table(gBoard)

    }
    if (gBoard[i][j].isShown) return

    var value
    elCell.classList.add('empty-cell')
    if (gBoard[i][j].minesAroundCount === 0) {
        gBoard[i][j].isShown = true
        gGame.shownCount++
        console.log('show count: ' + gGame.shownCount)
        expandShown(gBoard, elCell, i, j) //TODO class of empty, open negs cells
        checkGameOver()
        return
    }
    if (gBoard[i][j].isMine) {  // LIVES --
        clickOnMine(elCell, i, j)
        return
    }

    else {
        value = gBoard[i][j].minesAroundCount
        gBoard[i][j].isShown = true
        gGame.shownCount++
        console.log('show count: ' + gGame.shownCount)

        elCell.innerHTML = value
        checkGameOver()
    }


    // switch (value) {
    //     case 1:
    //         elCell.style.color = 'blue'
    //         break;
    //     case 2:
    //         elCell.style.color = 'green'
    //         break;




    //     default:
    //         elCell.style.color = 'black'


    // }
    //elCell = document.querySelector(`.cell-${i}-${j}`)

}

function setMinesOnBoardByClick(firstclickI, firstClickJ) {
    var locations = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (firstclickI === i && firstClickJ === j) continue
            locations.push({ i, j })
        }
    }

    for (var i = 0; i < gLevel.MINES; i++) {
        var randIdx = getRandomIntInclusive(0, locations.length - 1)
        var currLocation = locations[randIdx]
        locations.splice(randIdx, 1)
        gBoard[currLocation.i][currLocation.j].isMine = true
    }
}

function onCellMarked(elCell, i, j) { //TODO  ISMARKED
    var value
    if (!gBoard[i][j].isMarked) {
        value = FLAG
        gBoard[i][j].isMarked = true
        gBoard[i][j].isShown = true
        gGame.markedCount++
        gGame.shownCount++
        // console.log('mark count:  ' + gGame.markedCount)
        // console.log('show count:  ' + gGame.shownCount)
        checkGameOver()
    }
    else {
        value = ''
        gBoard[i][j].isMarked = false
        gBoard[i][j].isShown = false
        gGame.markedCount--
        gGame.shownCount--
        console.log('mark count:  ' + gGame.markedCount)
        console.log('show count:  ' + gGame.shownCount)


    }
    //elCell = document.querySelector(`.cell-${i}-${j}`)
    elCell.innerHTML = value

}

function clickOnMine(elCell, i, j) {
    var value = MINE
    gBoard[i][j].isShown = true
    gBoard[i][j].isMarked = true
    gGame.markedCount++
    gGame.shownCount++
    console.log('mark count ' + gGame.markedCount)
    console.log('show count ' + gGame.shownCount)

    //elCell = document.querySelector(`.cell-${i}-${j}`)
    elCell.innerHTML = value

}

function checkGameOver() {
    if (gGame.shownCount === gLevel.SIZE ** 2 && gGame.markedCount === gLevel.MINES) {
        gGame.isOn = false
        console.log('WINNER!!!')


    }


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


            if (gBoard[i][j].isShown) continue

            if (value === 0) {
                elCell.classList.add('empty-cell')
                gBoard[i][j].isShown = true
                gGame.shownCount++
                console.log('show count:  ' + gGame.shownCount)
                expandShown(board, elCell, i, j)
            } else {
                elCell.innerHTML = value
                gBoard[i][j].isShown = true
                elCell.classList.add('empty-cell')
                gGame.shownCount++
                console.log('show count:  ' + gGame.shownCount)
            }

        }
    }
}

function setBeginnerLevel() {
    gLevel = {
        SIZE: 4,
        MINES: 2
    }
    onInit()
}

function setMediumLevel() {
    gLevel = {
        SIZE: 8,
        MINES: 14
    }
    onInit()
}

function setExpertLevel() {
    gLevel = {
        SIZE: 12,
        MINES: 32
    }
    onInit()
}
// function renderCell(location, value) {   //  REUSE CODE
//     const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
//     elCell.innerHTML = value
// }

