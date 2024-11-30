// DOM Elements
const clickButton = document.getElementById('click-button');
const coffeeNumberDisplay = document.getElementById('coffee-number');
const coffeePerClickDisplay = document.getElementById('coffee-number-click');
const coffeePerSecondDisplay = document.getElementById('coffee-number-second');

const cursorUpdateBtn = document.querySelector('#cursor > input');
const factoryUpdateBtn = document.querySelector('#factory > input');
const multiplierUpdateBtn = document.querySelector('#multiplier > input');

// Cookie Banner Elements
const cookieBanner = document.getElementById('cookie-banner');
const agreeButton = document.getElementById('agree-button');
const disagreeButton = document.getElementById('disagree-button');

// Default values (in case there's no saved data)
let coffee = 0;
let coffeePerClick = 1;
let coffeePerSecond = 0;

let cursorLevel = 1;
let cursorPrice = 10;
let factoryLevel = 0;
let factoryPrice = 50;
let multiplierLevel = 1;
let multiplierPrice = 100;

// Load saved game state from localStorage
function loadGame() {
    coffee = parseInt(localStorage.getItem('coffee')) || 0;
    coffeePerClick = parseInt(localStorage.getItem('coffeePerClick')) || 1;
    coffeePerSecond = parseInt(localStorage.getItem('coffeePerSecond')) || 0;

    cursorLevel = parseInt(localStorage.getItem('cursorLevel')) || 1;
    cursorPrice = parseInt(localStorage.getItem('cursorPrice')) || 10;
    factoryLevel = parseInt(localStorage.getItem('factoryLevel')) || 0;
    factoryPrice = parseInt(localStorage.getItem('factoryPrice')) || 50;
    multiplierLevel = parseInt(localStorage.getItem('multiplierLevel')) || 1;
    multiplierPrice = parseInt(localStorage.getItem('multiplierPrice')) || 100;

    showCoffee(); // Update the UI with the loaded values
}

// Save game state to localStorage
function saveGame() {
    localStorage.setItem('coffee', coffee);
    localStorage.setItem('coffeePerClick', coffeePerClick);
    localStorage.setItem('coffeePerSecond', coffeePerSecond);

    localStorage.setItem('cursorLevel', cursorLevel);
    localStorage.setItem('cursorPrice', cursorPrice);
    localStorage.setItem('factoryLevel', factoryLevel);
    localStorage.setItem('factoryPrice', factoryPrice);
    localStorage.setItem('multiplierLevel', multiplierLevel);
    localStorage.setItem('multiplierPrice', multiplierPrice);
}

// Increment coffee on click
clickButton.addEventListener('click', () => {
    coffee += coffeePerClick;
    saveGame();
    showCoffee();
});

// Cursor upgrade: increases coffee per click
cursorUpdateBtn.addEventListener('click', () => {
    if (coffee >= cursorPrice) {
        cursorLevel++;
        coffeePerClick += 1 * multiplierLevel; // Coffee per click scales with multiplier
        coffee -= cursorPrice;
        cursorPrice *= 2; // Price doubles after every purchase
        saveGame();
        showCoffee();
    }
});

// Factory upgrade: increases coffee per second
factoryUpdateBtn.addEventListener('click', () => {
    if (coffee >= factoryPrice) {
        factoryLevel++;
        coffeePerSecond += 1 * multiplierLevel; // Coffee per second scales with multiplier
        coffee -= factoryPrice;
        factoryPrice *= 2; // Price doubles after every purchase
        saveGame();
        showCoffee();
    }
});

// Multiplier upgrade: scales coffee per click and per second
multiplierUpdateBtn.addEventListener('click', () => {
    if (coffee >= multiplierPrice) {
        multiplierLevel++;
        coffeePerClick = cursorLevel * multiplierLevel; // Recalculate based on levels
        coffeePerSecond = factoryLevel * multiplierLevel; // Recalculate based on levels
        coffee -= multiplierPrice;
        multiplierPrice *= 3; // Price triples after every purchase
        saveGame();
        showCoffee();
    }
});

// Game loop: adds coffee per second every second
function gameloop() {
    coffee += coffeePerSecond;
    saveGame();
    showCoffee();
}

// Update the UI to reflect game state
function showCoffee() {
    coffeeNumberDisplay.innerHTML = formatNumber(coffee);
    coffeePerClickDisplay.innerHTML = formatNumber(coffeePerClick);
    coffeePerSecondDisplay.innerHTML = formatNumber(coffeePerSecond);

    // Update upgrade views
    updateUpgradeView('cursor', cursorLevel, cursorPrice);
    updateUpgradeView('factory', factoryLevel, factoryPrice);
    updateUpgradeView('multiplier', multiplierLevel, multiplierPrice);

    // Disable buttons if coffee is insufficient
    setDisable(coffee >= cursorPrice, cursorUpdateBtn);
    setDisable(coffee >= factoryPrice, factoryUpdateBtn);
    setDisable(coffee >= multiplierPrice, multiplierUpdateBtn);
}

// Update the display for an upgrade
function updateUpgradeView(id, level, price) {
    const levelDisplay = document.querySelector(`#${id} > .level`);
    const priceDisplay = document.querySelector(`#${id} .price`);
    levelDisplay.innerHTML = level;
    priceDisplay.innerHTML = formatNumber(price);
}

// Disable or enable buttons
function setDisable(able, btn) {
    if (able) {
        btn.removeAttribute("disabled");
    } else {
        btn.setAttribute("disabled", "");
    }
}

// Format large numbers for better readability
function formatNumber(num) {
    if (num > 1000000000) {
        return (num / 1000000000).toFixed(2) + ' B';
    }
    if (num > 1000000) {
        return (num / 1000000).toFixed(2) + ' M';
    }
    if (num > 1000) {
        return (num / 1000).toFixed(2) + ' K';
    }
    return num;
}

// Check if the user has agreed to the cookies
function checkCookieAgreement() {
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
        // If no consent, show the banner
        cookieBanner.style.display = 'block';
    } else {
        // If consent is already given, hide the banner and load the game
        cookieBanner.style.display = 'none';
        loadGame();
        setInterval(gameloop, 1000);
    }
}

// Handle agreement
agreeButton.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'true'); // Store the user's agreement
    cookieBanner.style.display = 'none'; // Hide the banner
    loadGame(); // Proceed with loading the game
    setInterval(gameloop, 1000); // Start the game loop
});

// Handle disagreement
disagreeButton.addEventListener('click', () => {
    window.location.href = '../index.html'; // Redirect to the index page if they disagree
});

// Initialize game
checkCookieAgreement();
