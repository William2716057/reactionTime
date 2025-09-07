let gameScreen = document.getElementById("game-screen");
let message = document.getElementById("message");

let startTime = null;
let isRed = false;
let timeoutId = null;

function startGame() {
    message.textContent = "Wait for red...";
    gameScreen.style.backgroundColor = "green";
    isRed = false;

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
        // Clicked too early
        clearTimeout(timeoutId);
        message.textContent = "Too soon! Try again.";
        gameScreen.style.backgroundColor = "darkred";
        setTimeout(startGame, 1500);
    } else {
        // Valid click
        const endTime = new Date().getTime();
        const reactionTime = ((endTime - startTime) / 1000).toFixed(3);
        message.textContent = `Your reaction time: ${reactionTime} seconds`;
        gameScreen.style.backgroundColor = "green";
        isRed = false;
        setTimeout(startGame, 3000);
    }
});

window.onload = startGame;