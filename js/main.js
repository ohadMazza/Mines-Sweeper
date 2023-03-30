'use strict'

const MINE = '💣'
const FLAG = '🚩'
const NORMAL = '🙂'
const LOSE = '🤯'
const WIN = '😎'

var gBoard
var gTimer
var gTimerInterval
var gIsFirstMove = true
var gMinesCount
var gLives

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
    gLives = 3

    var elTimer = document.querySelector('#timer')
    clearInterval(gTimerInterval);
    elTimer.textContent = '00:00'

    gMinesCount = gLevel.MINES
    gIsFirstMove = true
    gGame.isOn = true
    gGame.shownCount = 0
    gGame.markedCount = 0
    gBoard = buildBoard()
    renderBoard(gBoard)
    initHeader()
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
        expandShown(gBoard, elCell, i, j)
        checkGameOver()
        return
    }
    if (gBoard[i][j].isMine) {
        clickOnMine(elCell, i, j)
        return
    }

    else {
        value = gBoard[i][j].minesAroundCount
        gBoard[i][j].isShown = true
        gGame.shownCount++

        elCell.innerHTML = value
        colorsNums(elCell, value)
        checkGameOver()

    }

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

function onCellMarked(elCell, i, j) {
    if (!gGame.isOn) return
    if (gBoard[i][j].isShown) return
    var value
    if (!gBoard[i][j].isMarked) {
        value = FLAG
        updateMinesCountDown()
        gBoard[i][j].isMarked = true
        gGame.markedCount++
        checkGameOver()
    }
    else {
        value = ''
        gBoard[i][j].isMarked = false
        gGame.markedCount--
        updateMinesCountUp()
    }
    elCell.innerHTML = value

}

function clickOnMine(elCell, i, j) {
    var value = MINE
    gBoard[i][j].isShown = true
    gBoard[i][j].isMarked = true
    gGame.markedCount++
    updateMinesCountDown()

    var elLives = document.querySelector('.lives')
    var strLives = elLives.textContent
    strLives = strLives.substring(1);
    elLives.innerHTML = strLives
    gLives--
    elCell.innerHTML = value
    checkGameOver()

}

function checkGameOver() {
    if (gGame.shownCount + gGame.markedCount === gLevel.SIZE ** 2 && gGame.markedCount === gLevel.MINES) {
        gGame.isOn = false
        stopTimer()

        var elSmile = document.querySelector('.smiley')
        elSmile.innerHTML = WIN

        var elMSsg = document.querySelector('.msg')
        elMSsg.style.display = 'block'

        var elSpan = document.querySelector('h1 span')
        elSpan.textContent = 'WIN!'
    }
    if (gLives === 0) {
        gGame.isOn = false
        stopTimer()

        var elSmile = document.querySelector('.smiley')
        elSmile.innerHTML = LOSE

        var elMSsg = document.querySelector('.msg')
        elMSsg.style.display = 'block'

        var elSpan = document.querySelector('h1 span')
        elSpan.textContent = 'LOSE!'

        showBoard()

    }
}

function showBoard() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var elCell = document.querySelector(`.cell-${i}-${j}`)
            elCell.classList.add('empty-cell')

            if (gBoard[i][j].minesAroundCount !== 0 && gBoard[i][j].minesAroundCount !== null) {
                var value = gBoard[i][j].minesAroundCount
                colorsNums(elCell, value)
                elCell.innerHTML = value
            }
            if (gBoard[i][j].minesAroundCount === 0) continue
            if (gBoard[i][j].isMine) {
                var value = MINE
                elCell.innerHTML = value
            }
        }
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
                colorsNums(elCell, value)
                gBoard[i][j].isShown = true
                elCell.classList.add('empty-cell')
                gGame.shownCount++
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

function initHeader() {
    var elSpan = document.querySelector('.mines')
    elSpan.innerHTML = gLevel.MINES

    var elSmile = document.querySelector('.smiley')
    elSmile.innerHTML = NORMAL

    var elLives = document.querySelector('.lives')
    elLives.innerHTML = '❤❤❤'

    var elMSsg = document.querySelector('.msg')
    elMSsg.style.display = 'none'

}

function updateMinesCountDown() {
    var elSpan = document.querySelector('.mines')
    gMinesCount--
    elSpan.innerHTML = gMinesCount
}
function updateMinesCountUp() {
    var elSpan = document.querySelector('.mines')
    gMinesCount++
    elSpan.innerHTML = gMinesCount
}

function colorsNums(elCell, value) {
    switch (value) {
        case 1:
            elCell.style.color = 'blue'
            break;
        case 2:
            elCell.style.color = 'green'
            break;
        case 3:
            elCell.style.color = 'red'
            break;
        case 4:
            elCell.style.color = 'purple'

            break;
        case 5:
            elCell.style.color = 'maroon'

            break;
        case 6:
            elCell.style.color = 'blue'

            break;
        default:
            elCell.style.color = 'sturquoise'
    }
}


// function renderCell(location, value) {   //  REUSE CODE
//     const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
//     elCell.innerHTML = value
// }

