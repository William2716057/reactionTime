let gameScreen = document.getElementById("game-screen");
let message = document.getElementById("message");
let bestTimeDisplay = document.getElementById("best-time");
let leaderboard = document.getElementById("leaderboard");
let toggleThemeBtn = document.getElementById("toggle-theme");
let startTime = null;
let isRed = false;
let timeoutId = null;

const shareBtn = document.getElementById("share-btn");
const sharedTimeDisplay = document.getElementById("shared-time");



// Best Time Functions
function getBestTime() {
    return localStorage.getItem("bestTime");
}

function setBestTime(time) {
    localStorage.setItem("bestTime", time);
}

// Leaderboard Functions
function getLeaderboard() {
    return JSON.parse(localStorage.getItem("leaderboard") || "[]");
}

function updateLeaderboard(time) {
    let board = getLeaderboard();
    board.unshift(time); // Add new time to start
    if (board.length > 5) board = board.slice(0, 5); // Keep last 5
    localStorage.setItem("leaderboard", JSON.stringify(board));
}

function displayLeaderboard() {
    let board = getLeaderboard();
    leaderboard.innerHTML = "<strong>Last 5 Times:</strong>";
    board.forEach((time, index) => {
        let li = document.createElement("li");
        li.textContent = `#${index + 1}: ${time} s`;
        leaderboard.appendChild(li);
    });
}

// Best Time Display
function displayBestTime() {
    const best = getBestTime();
    if (best) {
        bestTimeDisplay.textContent = `Best Time: ${best} seconds`;
    } else {
        bestTimeDisplay.textContent = `Best Time: --`;
    }
}

// Theme Toggle
function loadTheme() {
    const theme = localStorage.getItem("theme") || "dark";
    document.body.classList.toggle("light-mode", theme === "light");
}

function toggleTheme() {
    const isLight = document.body.classList.toggle("light-mode");
    localStorage.setItem("theme", isLight ? "light" : "dark");
}

// Game Logic
function startGame() {
    message.textContent = "Wait for red...";
    gameScreen.style.backgroundColor = "green";
    isRed = false;
    displayBestTime();
    displayLeaderboard();

    const randomDelay = Math.random() * 3000 + 2000;

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

        // Best time logic
        const best = getBestTime();
        if (!best || reactionTime < parseFloat(best)) {
            setBestTime(reactionTime);
            message.textContent += " ?? New Best!";
        }

        // Leaderboard logic
        updateLeaderboard(reactionTime);

        isRed = false;
        setTimeout(startGame, 3000);
    }
});

// Theme toggle
toggleThemeBtn.addEventListener("click", toggleTheme);

// Initialize
window.onload = () => {
    loadTheme();
    startGame();
};

function createShareLink(bestTime) {
    const url = new URL(window.location.href);
    url.searchParams.set("best", bestTime);
    return url.toString();
}

shareBtn.addEventListener("click", () => {
    const best = getBestTime();
    if (!best) {
        alert("No best time to share yet!");
        return;
    }

    const shareLink = createShareLink(best);
    navigator.clipboard.writeText(shareLink).then(() => {
        sharedTimeDisplay.textContent = "Link copied to clipboard!";
    }).catch(() => {
        alert("Failed to copy link.");
    });
});

// Check for shared best time in URL
function checkSharedTimeFromURL() {
    const params = new URLSearchParams(window.location.search);
    const sharedBest = params.get("best");
    if (sharedBest) {
        sharedTimeDisplay.textContent = `Shared Best Time: ${sharedBest} seconds`;
    }
}

// Run it on load
window.onload = () => {
    loadTheme();
    checkSharedTimeFromURL();
    startGame();
};

const resetBtn = document.getElementById("reset-scores");

resetBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to reset your best time and leaderboard?")) {
        localStorage.removeItem("bestTime");
        localStorage.removeItem("leaderboard");
        displayBestTime();
        displayLeaderboard();
        sharedTimeDisplay.textContent = "Scores reset.";
        setTimeout(() => {
            sharedTimeDisplay.textContent = "";
        }, 3000);
    }
});
