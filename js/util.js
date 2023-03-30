'use strict'

// document.addEventListener('contextmenu', e => {
//     e.preventDefault()
// })

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


    return board
}

// function startTimer() {
//     var startTime = new Date().getTime();
//     var gTimer = setInterval(() => {

//         var runningClock = document.querySelector('h2')
//         runningClock.innerText = timeString

//         var elapsedTime = new Date().getTime() - startTime - 1;
//         var minutes = Math.floor((elapsedTime % 3600000) / 60000);
//         var seconds = Math.floor((elapsedTime % 60000) / 1000);

//         var timeString = `${minutes}:${seconds.toString().padStart(2, "0")}`;
//         var elTimer = document.querySelector('.timer')
//         elTimer.innerHTML = timeString

//     }, 1000);
// }


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


















function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}



