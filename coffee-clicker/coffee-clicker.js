// Grab DOM elements
const coffeeMugButton = document.getElementById("coffee-mug-button");
const brewButton = document.getElementById("brew-button");
const coffeeNumberDisplay = document.getElementById("coffee-number");
const coffeeNumberClickDisplay = document.getElementById("coffee-number-click");
const coffeeNumberSecondDisplay = document.getElementById("coffee-number-second");

const cursorUpgradeButton = document.getElementById("cursor-upgrade");
const factoryUpgradeButton = document.getElementById("factory-upgrade");
const multiplierUpgradeButton = document.getElementById("multiplier-upgrade");

const cursorPriceDisplay = document.getElementById("cursor-price");
const factoryPriceDisplay = document.getElementById("factory-price");
const multiplierPriceDisplay = document.getElementById("multiplier-price");

// Load saved game state from localStorage
function loadGameState() {
    const savedState = JSON.parse(localStorage.getItem("coffeeGameState"));
    if (savedState) {
        coffee = savedState.coffee || 0;
        coffeePerClick = savedState.coffeePerClick || 1;
        coffeePerSecond = savedState.coffeePerSecond || 0;

        cursorLevel = savedState.cursorLevel || 1;
        cursorPrice = savedState.cursorPrice || 10;
        factoryLevel = savedState.factoryLevel || 0;
        factoryPrice = savedState.factoryPrice || 50;
        multiplierLevel = savedState.multiplierLevel || 1;
        multiplierPrice = savedState.multiplierPrice || 100;
    } else {
        // If no saved state, initialize with defaults
        coffee = 0;
        coffeePerClick = 1;
        coffeePerSecond = 0;

        cursorLevel = 1;
        cursorPrice = 10;
        factoryLevel = 0;
        factoryPrice = 50;
        multiplierLevel = 1;
        multiplierPrice = 100;
    }
}

// Save game state to localStorage
function saveGameState() {
    const gameState = {
        coffee: coffee,
        coffeePerClick: coffeePerClick,
        coffeePerSecond: coffeePerSecond,
        cursorLevel: cursorLevel,
        cursorPrice: cursorPrice,
        factoryLevel: factoryLevel,
        factoryPrice: factoryPrice,
        multiplierLevel: multiplierLevel,
        multiplierPrice: multiplierPrice
    };
    localStorage.setItem("coffeeGameState", JSON.stringify(gameState));
}

// Show coffee and update button states
function showCoffee() {
    coffeeNumberDisplay.textContent = coffee;
    coffeeNumberClickDisplay.textContent = coffeePerClick;
    coffeeNumberSecondDisplay.textContent = coffeePerSecond;

    cursorPriceDisplay.textContent = cursorPrice;
    factoryPriceDisplay.textContent = factoryPrice;
    multiplierPriceDisplay.textContent = multiplierPrice;

    // Disable buttons if not enough coffee
    setButtonState(cursorUpgradeButton, coffee >= cursorPrice);
    setButtonState(factoryUpgradeButton, coffee >= factoryPrice);
    setButtonState(multiplierUpgradeButton, coffee >= multiplierPrice);

    // Save the game state after updating
    saveGameState();
}

// Set the state (enabled/disabled) of a button
function setButtonState(button, enabled) {
    if (enabled) {
        button.removeAttribute("disabled");
    } else {
        button.setAttribute("disabled", "true");
    }
}

// Brew button event listener
brewButton.addEventListener("click", function() {
    console.log("Brew button clicked.");  // Debugging log
    coffee += coffeePerClick;
    showCoffee();
});

// Upgrade button event listeners
cursorUpgradeButton.addEventListener("click", function() {
    if (coffee >= cursorPrice) {
        coffee -= cursorPrice;
        cursorLevel++;
        coffeePerClick = cursorLevel * multiplierLevel;
        cursorPrice = Math.floor(cursorPrice * 1.5);
        showCoffee();
    }
});

factoryUpgradeButton.addEventListener("click", function() {
    if (coffee >= factoryPrice) {
        coffee -= factoryPrice;
        factoryLevel++;
        coffeePerSecond = factoryLevel * multiplierLevel;
        factoryPrice = Math.floor(factoryPrice * 1.5);
        showCoffee();
    }
});

multiplierUpgradeButton.addEventListener("click", function() {
    if (coffee >= multiplierPrice) {
        coffee -= multiplierPrice;
        multiplierLevel++;
        coffeePerClick = cursorLevel * multiplierLevel;
        coffeePerSecond = factoryLevel * multiplierLevel;
        multiplierPrice = Math.floor(multiplierPrice * 1.5);
        showCoffee();
    }
});

// Game loop function to add coffee per second
function gameLoop() {
    coffee += coffeePerSecond;
    showCoffee();
}

// Load game state when the page loads
loadGameState();

// Start the game loop
setInterval(gameLoop, 1000); // Game loop to increase coffee per second

// Grab cookie consent banner and buttons
const cookieBanner = document.getElementById("cookie-banner");
const cookieAcceptButton = document.getElementById("cookie-accept");
const cookieDeclineButton = document.getElementById("cookie-decline");

// Function to check if cookies have been accepted
function checkCookieConsent() {
    const consent = localStorage.getItem("cookieConsent");
    if (consent === "accepted") {
        startGame(); // If consent is already given, start the game
    } else {
        cookieBanner.style.display = "block"; // Show the banner if consent not given
    }
}

// Handle cookie acceptance
cookieAcceptButton.addEventListener("click", function() {
    localStorage.setItem("cookieConsent", "accepted"); // Store the consent in localStorage
    cookieBanner.style.display = "none"; // Hide the banner
    startGame(); // Start the game after acceptance
});

// Handle cookie decline
cookieDeclineButton.addEventListener("click", function() {
    localStorage.setItem("cookieConsent", "declined"); // Store the declined consent
    cookieBanner.style.display = "none"; // Hide the banner (you can show a different message if needed)
    // Optionally, redirect or stop further interaction here (e.g., redirect to another page)
    window.location.href = "../index.html"; // Redirect to the main page if declined
});

// Function to start the game
function startGame() {
    loadGameState(); // Initialize the game state
    setInterval(gameLoop, 1000); // Start the game loop
}

// Check if cookie consent has been accepted when the page loads
window.addEventListener("load", function() {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent || consent !== "accepted") {
        cookieBanner.style.display = "block"; // Show the banner if not accepted
    } else {
        startGame(); // Start the game immediately if consent is already given
    }
});
