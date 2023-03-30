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

    return board
}

function startTimer() {
    gTimer = Date.now();
    gTimerInterval = setInterval(updateTimer, 1000);
}

function stopTimer() {
    clearInterval(gTimerInterval);
}

function updateTimer() {
    var elapsedTime = Date.now() - gTimer;
    var minutes = Math.floor(elapsedTime / (1000 * 60));
    var seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);

    var elTimer = document.querySelector('#timer')
    elTimer.textContent = formatTime(minutes) + ':' + formatTime(seconds)
}

function formatTime(time) {
    return (time < 10 ? '0' : '') + time;
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


















function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}



