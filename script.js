// Your JavaScript code remains unchanged
let coinBalance = 0;
let diamondBalance = 0;
let redDiamondBalance = 0;
let greenDiamondBalance = 0;
let spinLimit = 5;
let recentRewards = [];

document.addEventListener("DOMContentLoaded", function() {
    updateDashboard();

    document.getElementById("spinButton").addEventListener("click", spinWheel);
    document.getElementById("adButton").addEventListener("click", watchAd);
    document.getElementById("buyButton").addEventListener("click", buySpin);
});

function spinWheel() {
    // Show spinner
    document.getElementById("spinner").style.display = "block";
    document.getElementById("spinnerImage").style.display = "block";

    if (spinLimit > 0) {
        spinLimit--;

        // Simulate the spin and calculate rewards
        let result = Math.floor(Math.random() * 100) + 1; // Generate a random number between 1 and 100
        if (result === 1) { // 1% chance of getting a valuable reward
            let diamondType = Math.floor(Math.random() * 10); // Generate a random number between 0 and 9
            switch (diamondType) {
                case 0:
                case 1:
                    addRedDiamonds(10); // Red diamond (2% chance)
                    break;
                case 2:
                case 3:
                case 4:
                    addGreenDiamonds(30); // Green diamond (3% chance)
                    break;
                default:
                    addDiamonds(100); // Normal diamond (5% chance)
                    break;
            }
        } else {
            addCoins(10);
        }

        // Update balances and display recent rewards
        updateDashboard();

        // Hide spinner after a short delay (simulating a server response)
        setTimeout(function() {
            document.getElementById("spinner").style.display = "none";
            document.getElementById("spinnerImage").style.display = "none";
        }, 1000); // Adjust the delay as needed
    } else {
        alert("You have reached your spin limit for this hour.");

        // Hide spinner if spin limit is reached
        document.getElementById("spinner").style.display = "none";
        document.getElementById("spinnerImage").style.display = "none";
    }
}

function watchAd() {
    spinLimit++; // Add an extra spin
    updateDashboard();
}

function buySpin() {
    if (coinBalance >= 1000) {
        coinBalance -= 1000; // Deduct 1000 coins
        spinLimit++;
        updateDashboard();
    } else {
        alert("You don't have enough Money to claim.");
    }
}

function addCoins(amount) {
    coinBalance += amount;
    recentRewards.unshift(`You won ${amount} coins!`);
}

// Other functions remain unchanged...

function addDiamonds(amount) {
    diamondBalance += amount;
    recentRewards.unshift(`You won ${amount} normal diamonds!`);
}

function addRedDiamonds(amount) {
    redDiamondBalance += amount;
    recentRewards.unshift(`You won ${amount} red diamonds!`);
}

function addGreenDiamonds(amount) {
    greenDiamondBalance += amount;
    recentRewards.unshift(`You won ${amount} green diamonds!`);
}

function updateDashboard() {
    document.getElementById("coinBalance").textContent = coinBalance;
    document.getElementById("diamondBalance").textContent = diamondBalance;
    document.getElementById("redDiamondBalance").textContent = redDiamondBalance;
    document.getElementById("greenDiamondBalance").textContent = greenDiamondBalance;
    document.getElementById("spinLimit").textContent = spinLimit;

    // Display recent rewards
    let recentRewardsList = document.getElementById("recentRewards");
    recentRewardsList.innerHTML = "";
    for (let i = 0; i < recentRewards.length && i < 5; i++) {
        let listItem = document.createElement("li");
        listItem.textContent = recentRewards[i];
        recentRewardsList.appendChild(listItem);
    }

    // Check if user has reached conversion thresholds and convert to dollars
    convertToDollars();
}

function convertToDollars() {
    let dollarsEarned = 0;

    // Convert coins to dollars
    if (coinBalance >= 1000) {
        dollarsEarned += Math.floor(coinBalance / 1000);
        coinBalance %= 1000;
    }

    // Convert red diamonds to dollars
    if (redDiamondBalance >= 100) {
        dollarsEarned += Math.floor(redDiamondBalance / 100);
        redDiamondBalance %= 100;
    }

    // Convert green diamonds to dollars
    if (greenDiamondBalance >= 300) {
        dollarsEarned += Math.floor(greenDiamondBalance / 300);
        greenDiamondBalance %= 300;
    }

    // Convert normal diamonds to dollars
    if (diamondBalance >= 500) {
        dollarsEarned += Math.floor(diamondBalance / 500);
        diamondBalance %= 500;
    }

    if (dollarsEarned > 0) {
        alert(`Congratulations! You've earned $${dollarsEarned}`);
    }
}
