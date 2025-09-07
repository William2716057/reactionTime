let gameScreen = document.getElementById("game-screen");
let message = document.getElementById("message");
let bestTimeDisplay = document.getElementById("best-time");

let startTime = null;
let isRed = false;
let timeoutId = null;

function getBestTime() {
    return localStorage.getItem("bestTime");
}

function setBestTime(time) {
    localStorage.setItem("bestTime", time);
}

function displayBestTime() {
    const best = getBestTime();
    if (best) {
        bestTimeDisplay.textContent = `Best Time: ${best} seconds`;
    } else {
        bestTimeDisplay.textContent = `Best Time: --`;
    }
}

function startGame() {
    message.textContent = "Wait for red...";
    gameScreen.style.backgroundColor = "green";
    isRed = false;
    displayBestTime();

    const randomDelay = Math.random() * 3000 + 2000; // 2 to 5 seconds

    timeoutId = setTimeout(() => {
        gameScreen.style.backgroundColor = "red";
        message.textContent = "CLICK!";
        startTime = new Date().getTime();
        isRed = true;
    }, randomDelay);
}

gameScreen.addEventListener("click", () => {
    if (!isRed) {
        clearTimeout(timeoutId);
        message.textContent = "Too soon! Try again.";
        gameScreen.style.backgroundColor = "darkred";
        setTimeout(startGame, 1500);
    } else {
        const endTime = new Date().getTime();
        const reactionTime = ((endTime - startTime) / 1000).toFixed(3);
        message.textContent = `Your reaction time: ${reactionTime} seconds`;

        // Check for best time
        const best = getBestTime();
        if (!best || reactionTime < parseFloat(best)) {
            setBestTime(reactionTime);
            message.textContent += " ?? New Best!";
        }

        isRed = false;
        setTimeout(startGame, 3000);
    }
});

window.onload = startGame;