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

function startTimer() {
    // var startTime = new Date().getTime();
    // var gTimer = setInterval(() => {

    //     var runningClock = document.querySelector('h2')
    //     runningClock.innerText = timeString

    //     var elapsedTime = new Date().getTime() - startTime - 1;
    //     //time++;
    //     // Format the time as minutes and seconds
    //     var minutes = Math.floor((elapsedTime % 3600000) / 60000);
    //     var seconds = Math.floor((elapsedTime % 60000) / 1000);
    //     // const minutes = Math.floor(time / 60);
    //     // const seconds = time % 60;
    //     // Display the timer in the element
    //     var timeString = `${minutes}:${seconds.toString().padStart(2, "0")}`;

    // }, 1000);
}



















function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}



