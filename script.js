// ==UserScript==
// @name         Best Buy Automation (Product Details)
// @namespace    akito
// @version      2.0.0
// @description  Auto-presses drops when button changes to Add
// @author       akito#9528 / Albert Sun
// @match        https://www.bestbuy.com/*skuId=*
// @match        https://www.bestbuy.com/site/combo/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

// Version Changelog
// 1.7.1 - Moved notification sound retrieval to page load so it would play correctly
// 1.8.0 - Added auto page-reload functionality on sold-out products with the given keywords
// 2.0.0 - Refactored existing code and added auto-reload for sold out / unavailable products

const version = "2.0.0";
const scriptDesc = `Best Buy Automation (Product Details) v${version} by akito#9528 / Albert Sun`;
const donationText = "Thank you! | Bitcoin: bc1q6u7kalsxunl5gleqcx3ez4zn6kmahrsnevx2w4 / 1KgcytPHXNwboNbXUN3ZyuASDZWt8Qcf1t | Paypal: akitocodes@gmail.com";

// Quick and dirty script configuration, feel free to edit this!
// - Ignore warnings with the /!\ symbol, just some whitespace linting stuff
// - Note that auto-reload might not work properly if Chrome / Firefox unloads resources or something
const scriptConfig = {
    keepPolling: false,   // Whether to continue periodically polling for product availability once added to cart            | Default: false
    initialClick: true,   // Whether to auto-click the "Add to Cart" button upon page load (if description includes keyword) | Default: true
    soldOutReload: true, // Whether to auto-reload the page after a delay when sold out (if description includes keyword)   | Default: true
    // ======================================================================================================================================
    pollInterval: 0.5, // In seconds, interval between periodic button polls when checking for availability              | Default: 0.5
    initialDelay: 0.5, // In seconds, delay on page load before auto-clicking the add button (to update existing status) | Default: 0.5
    soldOutDelay: 60,  // In seconds, delay before refreshing page when product is sold out (to refresh product details) | Default: 60
    // ======================================================================================================================================
    // Keyword inclusion whitelist for initial clicking and auto-reloading, delete or make empty array for script to ignore.
    // Default: ["3060", "3070", "3080", "3090", "6800", "6900", "5600X", "5800X", "5900X", "5950X", "PS5"]
    keywords: ["3060", "3070", "3080", "3090", "6800", "6900", "5600X", "5800X", "5900X", "5950X", "PS5"]
}

// Quick and dirty function which checks whether the given button / div is yellow (usually RGB around 255, 255, 0).
// Yellow usually means that the item is cartable (though different for the saved items page where it is instead white).
function buttonYellow(button) {
    return window.getComputedStyle(button, null).getPropertyValue("background-color").startsWith("rgb(255");
}

// Checks whether the given word (string) contains any of the given keywords (substrings).
// Automatically returns false if the keywords parameter is not an array.
function containsSubstring(word, keywords) {
    if(Array.isArray(keywords) === false) {
        return false;
    }

    for(const keyword of keywords) {
        if(word.includes(keyword)) {
            return true;
        }
    }
    return false;
}

(async function() {
    'use strict'; // Necessary? Comes default with Tampermonkey scripts

    // Initialize bottom banner for status + donation info
    const banner = document.createElement("div");
    banner.style.position = "fixed"; banner.style.bottom = "0px"; banner.style.zIndex = 100;
    banner.style.width = "100%"; banner.style.padding = "6px"; banner.style.alignItems = "center";
    banner.style.backgroundImage = "linear-gradient(to right, coral, crimson, coral, crimson)";
    banner.style.fontFamily = "Verdana"; banner.style.fontSize = "12px";
    banner.style.display = "flex"; banner.style.flexDirection = "row"; banner.style.justifyContent = "space-between";

    // Initialize status info (left side of bottom banner)
    const statusInfo = document.createElement("div");
    statusInfo.style.textAlign = "left"; statusInfo.style.paddingLeft = "10px";
    statusInfo.style.order = 0; statusInfo.style.flexBasis = "50%";
    statusInfo.innerText = `${scriptDesc} | Initializing script`;

    // Initialize donation info (right side of bottom banner)
    const donationInfo = document.createElement("div");
    donationInfo.style.textAlign = "right"; donationInfo.style.paddingRight = "10px";
    donationInfo.style.order = 1; donationInfo.style.flexBasis = "50%";
    donationInfo.innerText = donationText;

    // Actual bulk of the script including the auto-reloader and interval poller
    // Could use document-end instead of document-start and DOM load but I dunno what's better
    document.addEventListener("DOMContentLoaded", async function() {
        document.body.append(banner);
        banner.appendChild(statusInfo);
        banner.appendChild(donationInfo);

        // Preload audio because doesn't preload when tab not focused
        const audio = new Audio("https://proxy.notificationsounds.com/notification-sounds/definite-555/download/file-sounds-1085-definite.mp3");

        // Retrieve relevant HTML elements and information from page
        const addButton = document.getElementsByClassName("add-to-cart-button")[0];
        const productName = document.getElementsByTagName("title")[0].innerText;
        const hasKeyword = containsSubstring(productName, scriptConfig.keywords);

        // Check current product status (available, sold out / unavailable, queued) and update banner appropriately
        // Also process sold out / unavailable triggers at this point because it's convenient
        let addAvailable = buttonYellow(addButton);
        const disabled = addButton.classList.contains("btn-disabled");
        if(disabled === true) { // Button not clickable, either sold out or unavailable
            statusInfo.innerHTML = `${scriptDesc} | Product currently sold out or unavailable, `;
            if(scriptConfig.soldOutReload === true && hasKeyword === true) {
                statusInfo.innerHTML += `auto-reloading in ${scriptConfig.soldOutDelay} seconds.`;

                await new Promise(r => setTimeout(r, scriptConfig.soldOutDelay * 1000)); // sleep function
                location.reload();
            } else {
                statusInfo.innerHTML += "auto-reload disabled " + (scriptConfig.soldOutReload === true
                    ? "because not whitelisted"
                    : "in script config"); // too long to add comments?

                return; // exit the script
            }
        }


        statusInfo.innerHTML = `${scriptDesc} | ` + (addAvailable === true
            ? "Add button clickable, " + (scriptConfig.initialClick === true && scriptConfig.initialClick === true && hasKeyword === true
                 ? `automatically clicking in ${scriptConfig.initialDelay} seconds.`
                 : "please click to initialize product queue.")
            : "Existing product queue detected, waiting for button availability change.");

        // Automatically click the button after a set interval if clickable and setting enabled.
        if(addAvailable === true && scriptConfig.initialClick === true && hasKeyword === true) {
            setTimeout(function() {
                addButton.click()
            }, scriptConfig.initialDelay * 1000);
        }

        // Initialize periodic polling for button color swap
        let intervalID = setInterval(function() {
            let nowAvailable = buttonYellow(addButton);
            if(addAvailable === true && nowAvailable === false) { // button clicked to enter queue (yellow => grey)
                statusInfo.innerHTML = `${scriptDesc} | Queue entry detected, waiting for button availability change`;
            } else if(addAvailable === false && nowAvailable === true) { // queue popped (grey => yellow)
                statusInfo.innerHTML = `{scriptDesc} | Availability change detected, button clicked and window opened. Good luck!`;

                // Click button, play audio, and open cart window
                addButton.click();
                window.open("https://www.bestbuy.com/checkout/r/fast-track");
                audio.play();

                // Cancel periodic polling depending on config
                if(scriptConfig.keepPolling === false) {
                    clearInterval(intervalID);
                }
            }
        }, scriptConfig.pollInterval * 1000);
    });

}());
