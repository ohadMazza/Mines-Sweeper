'use strict'

const MINE = '💣'
const FLAG = '🚩'
const NORMAL = '🙂'
const LOSE = '🤯'
const WIN = '😎'

var gBoard
var gTimer
var gTimerInterval
var gIsFirstMove
var gIsMegaHint

var gMegaHintCells
var gUndoData = []

var gLevel = {
    SIZE: 4,
    MINES: 2,
    LIVES: 1
}

var gGame = {
    minesCountDown: 0,
    lives: 0,
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function onInit() {
    gMegaHintCells = []
    gIsFirstMove = true
    gIsMegaHint = false

    gGame.minesCountDown = gLevel.MINES
    gIsFirstMove = true
    gGame.isOn = true
    gBoard = buildBoard()
    renderBoard(gBoard)
    initHeader()
}

function setMinesNegsCount() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j]
            if (currCell.isMine) continue
            var negsCount = minesNegsCountInCell(i, j)
            currCell.minesAroundCount = negsCount
        }
    }
}

function minesNegsCountInCell(rowIdx, colIdx) {
    var negsCount = 0

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= gBoard.length) continue
            if (i === rowIdx && j === colIdx) continue
            var currCell = gBoard[i][j]
            if (currCell.isMine) negsCount++
        }
    }
    return negsCount
}

function renderBoard(board) {
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            const className = `cell cell-${i}-${j}`

            strHTML += `<td onclick="onCellClicked(this, ${i}, ${j})" class="${className}"`
            strHTML += ` oncontextmenu="onCellMarked(this, ${i}, ${j}); return false">`
            strHTML += '</td>'
        }
        strHTML += '</tr>\n'
    }
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function onCellClicked(elCell, i, j) {
    if (gIsMegaHint) {
        megaHint(i, j)
        return
    }

    if (!gGame.isOn) return
    if (gIsFirstMove) {
        startTimer()
        gIsFirstMove = false
        setMinesOnBoardByClick(i, j)
        setMinesNegsCount()
        saveBoardData()

        var elBtn = document.querySelector('.m-hint')
        elBtn.disabled = false;
    }
    if (gBoard[i][j].isShown) return

    var value
    elCell.classList.add('empty-cell')
    var currCell = gBoard[i][j]
    if (currCell.minesAroundCount === 0) {
        currCell.isShown = true
        gGame.shownCount++
        expandShown(elCell, i, j)
        checkGameOver()
        saveBoardData()
        return
    }
    if (currCell.isMine) {
        clickOnMine(elCell, i, j)
        saveBoardData()
        return
    }
    else {
        value = currCell.minesAroundCount
        currCell.isShown = true
        gGame.shownCount++

        elCell.innerHTML = value
        colorsNums(elCell, value)
        checkGameOver()
        saveBoardData()

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
        if (gGame.markedCount === gLevel.MINES) return
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
    saveBoardData()

}

function clickOnMine(elCell, i, j) {
    var value = MINE
    gBoard[i][j].isShown = true
    gGame.markedCount++
    updateMinesCountDown()

    var elLives = document.querySelector('.lives')
    var strLives = elLives.textContent
    strLives = strLives.substring(1)
    elLives.innerHTML = strLives
    gGame.lives--
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
    if (gGame.lives === -1) gameOverLose()
}

function gameOverLose() {
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

function showBoard() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var elCell = document.querySelector(`.cell-${i}-${j}`)
            elCell.classList.add('empty-cell')


            var currCell = gBoard[i][j]
            if (currCell.minesAroundCount !== 0 && currCell.minesAroundCount !== null) {
                var value = currCell.minesAroundCount
                colorsNums(elCell, value)
                elCell.innerHTML = value
            }
            if (currCell.minesAroundCount === 0) continue
            if (currCell.isMine) {
                var value = MINE
                elCell.innerHTML = value
            }
        }
    }
}

function expandShown(elCell, rowIdx, colIdx) {
    var value
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= gBoard.length) continue
            if (i === rowIdx && j === colIdx) continue

            var currCell = gBoard[i][j]
            value = currCell.minesAroundCount
            elCell = document.querySelector(`.cell-${i}-${j}`)

            if (currCell.isShown) continue

            if (value === 0) {
                elCell.classList.add('empty-cell')
                currCell.isShown = true
                gGame.shownCount++
                expandShown(elCell, i, j)
            } else {
                elCell.innerHTML = value
                colorsNums(elCell, value)
                currCell.isShown = true
                elCell.classList.add('empty-cell')
                gGame.shownCount++
            }

        }
    }
}

function setBeginnerLevel() {
    gLevel = {
        SIZE: 4,
        MINES: 2,
        LIVES: 1
    }
    onInit()
}

function setMediumLevel() {
    gLevel = {
        SIZE: 8,
        MINES: 14,
        LIVES: 2
    }
    onInit()
}

function setExpertLevel() {
    gLevel = {
        SIZE: 12,
        MINES: 32,
        LIVES: 3
    }
    onInit()
}

function initHeader() {
    var elSpan = document.querySelector('.mines')
    elSpan.innerHTML = gLevel.MINES

    var elSmile = document.querySelector('.smiley')
    elSmile.innerHTML = NORMAL

    var elMSsg = document.querySelector('.msg')
    elMSsg.style.display = 'none'

    gGame.lives = gLevel.LIVES
    updateLives(gGame.lives)

    var elBtn = document.querySelector('.m-hint')
    elBtn.disabled = true
    elBtn.style.background = 'lightgray'

    var elTimer = document.querySelector('#timer')
    clearInterval(gTimerInterval)
    elTimer.textContent = '00:00'
}

function updateMinesCountDown() {
    var elSpan = document.querySelector('.mines')
    gGame.minesCountDown--
    if (gGame.minesCountDown < 0) {
        gameOverLose()
        return
    }
    elSpan.innerHTML = gGame.minesCountDown
}

function updateMinesCountUp() {
    var elSpan = document.querySelector('.mines')
    gGame.minesCountDown++
    elSpan.innerHTML = gGame.minesCountDown
}

function megaHint(i, j) {
    var cell = { i: i, j: j }
    gMegaHintCells.push(cell)
    if (gMegaHintCells.length === 2) {
        gIsMegaHint = false
        console.log('bla bla work')

        for (var i = gMegaHintCells[0].i; i <= gMegaHintCells[1].i; i++) {
            for (var j = gMegaHintCells[0].j; j <= gMegaHintCells[1].j; j++) {
                var elCell = document.querySelector(`.cell-${i}-${j}`)
                elCell.classList.add('empty-cell')

                var currCell = gBoard[i][j]
                if (currCell.minesAroundCount !== 0 && currCell.minesAroundCount !== null) {
                    var value = currCell.minesAroundCount
                    colorsNums(elCell, value)
                    elCell.innerHTML = value
                }
                if (currCell.minesAroundCount === 0) continue
                if (currCell.isMine) {
                    var value = MINE
                    elCell.innerHTML = value
                }
            }
        }

        setTimeout(() => {
            for (var i = gMegaHintCells[0].i; i <= gMegaHintCells[1].i; i++) {
                for (var j = gMegaHintCells[0].j; j <= gMegaHintCells[1].j; j++) {
                    elCell = document.querySelector(`.cell-${i}-${j}`)
                    elCell.classList.remove('empty-cell')
                    elCell.innerHTML = ''

                    var elBtn = document.querySelector('.m-hint')
                    elBtn.style.background = 'lightgray'
                    elBtn.disabled = true;
                }
            }
        }, 1500)
    }
}

function turnMegaHintTrue() {
    gIsMegaHint = true
    var elBtn = document.querySelector('.m-hint')
    elBtn.style.background = 'yellow'
}

function saveBoardData() {
    var boardcopy = gBoard.map(arr => [...arr.map(obj => obj ? { ...obj } : null)])
    var gGameCopy = { ...gGame }
    var gLevelCopy = { ...gLevel }
    var gameData = { boardcopy, gGameCopy, gLevelCopy }
    gUndoData.push(gameData)
}

function undo() {
    if (gUndoData.length === 1) return
    gUndoData.pop()
    var currData = gUndoData[gUndoData.length - 1]
    var currBoard = currData.boardcopy
    renderBoard(currBoard)
    for (var i = 0; i < currBoard.length; i++) {
        for (var j = 0; j < currBoard.length; j++) {
            var currCell = currBoard[i][j]
            var elCell = document.querySelector(`.cell-${i}-${j}`)
            if (currCell.isShown) {
                elCell.classList.add('empty-cell')
                var value = currCell.minesAroundCount;
                if (currCell.minesAroundCount !== null && currCell.minesAroundCount > 0) {
                    elCell.innerHTML = value
                    colorsNums(elCell, value)
                }
                if (currCell.minesAroundCount === null) elCell.innerHTML = MINE
            }
            if (currCell.isMarked) elCell.innerHTML = FLAG
        }
    }
    gBoard = currBoard.slice()
    gGame = { ...currData.gGameCopy }
    gLevel = { ...currData.gLevelCopy }

    var elSpan = document.querySelector('.mines')
    elSpan.innerHTML = gGame.minesCountDown

    updateLives(gGame.lives)
}


