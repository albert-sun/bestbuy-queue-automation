// ==UserScript==
// @name         Best Buy Automation (Cart Saved Items)
// @namespace    akito
// @version      1.0.2
// @description  Auto-presses drops when button changes to Add
// @author       akito#9528 / Albert Sun
// @updateURL    https://raw.githubusercontent.com/albert-sun/bestbuy-queue-automation/main/script_cart.js
// @downloadURL  https://raw.githubusercontent.com/albert-sun/bestbuy-queue-automation/main/script_cart.js
// @match        https://www.bestbuy.com/cart
// @run-at       document-start
// @grant        none
// ==/UserScript==
/* globals $ */

// Version Changelog
// 1.0.0 - Initial release, clunky reload on successful item addition because difficult to detect DOM unload
// 1.0.1 - Added forced refresh on queue initial entry to guarantee showing of "Please Wait" overlay, fixed keyword check
// 1.0.2 - Added update and download URL to metadata, go to Tampermonkey settings -> enable "Check Interval" for auto-updating

const version = "1.0.2";
const scriptDesc = `Best Buy Automation (Cart Saved Items) v${version} by akito#9528 / Albert Sun`;
const donationText = "Thank you! | Bitcoin: bc1q6u7kalsxunl5gleqcx3ez4zn6kmahrsnevx2w4 / 1KgcytPHXNwboNbXUN3ZyuASDZWt8Qcf1t | Paypal: akitocodes@gmail.com";

// Quick and dirty script configuration, feel free to edit this!
// - Ignore warnings with the /!\ symbol, just some whitespace linting stuff
// - Note that auto-reload might not work properly if Chrome / Firefox unloads resources or something
const scriptConfig = {
    pollInterval: 0.5, // In seconds, interval between periodic button polls when checking for availability              | Default: 0.5
    // ======================================================================================================================================
    // Keyword inclusion whitelist for initial clicking and auto-reloading, delete or make empty array for script to ignore.
    // Default: ["3060", "3070", "3080", "3090", "6800", "6900", "5600X", "5800X", "5900X", "5950X", "PS5"]
    keywords: ["3060", "3070", "3080", "3090", "6800", "6900", "5600X", "5800X", "5900X", "5950X", "PS5"]
}

// Quick and dirty function which checks whether the given button / div is yellow, white, or blue.
// These usually mean that the item is cartable (tested for product detail page and cart page).
function buttonClickable(button) {
    const rgb = window.getComputedStyle(button, null).getPropertyValue("background-color");

    return rgb.startsWith("rgb(255") || (rgb.startsWith("rgb(0") && !rgb.startsWith("rgb(0, 0"));
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

        // Periodically poll until saved item elements exist
        // Then, load their buttons along with product descriptions
        statusInfo.innerHTML = `${scriptDesc} | Waiting until saved item elements are loaded ...`;
        let productButtons;
        do { // Check whether saved items visible (> 0, otherwise keeps running?)
            productButtons = $(".saved-items__card-wrapper .btn.btn-block").toArray();
            await new Promise(r => setTimeout(r, 100));
        } while(productButtons.length === 0);
        const productNames = $(".saved-items__card-wrapper .simple-item__description").toArray();

        // Check all saved items for auto-click and queue addition
        const clicked = false; // Refresh page if any products initially clicked
        const productsQueue = []; // Elements to periodically poll for queue
        for(const index in productNames) {
            statusInfo.innerHTML = `${scriptDesc} | Analyzing ${Number(index)+1}/${productButtons.length} saved items from cart page.`;

            const addButton = productButtons[index];
            let available = buttonClickable(addButton); // Change product page too
            const disabled = !addButton.classList.contains("button-state-default"); // Coming soon or sold out
            const productDesc = productNames[index].innerText;

            // Check whether to initially click add button by checking keyword
            const hasKeyword = containsSubstring(productDesc, scriptConfig.keywords);
            if(hasKeyword === true && disabled === false && available === true) { // Whitelisted, unqueued, and clickable
                addButton.click();
                await new Promise(r => setTimeout(r, 250)); // Wait for click to propogate
                available = !buttonClickable(addButton); // Check whether entered into queue
                clicked = true;
            } // Once clicked, check whether product is now added to queue or something
            if(hasKeyword === true && disabled === false && available === false) { // Currently in queue
                productsQueue.push({
                    button: addButton,
                    description: productDesc,
                });
            }
        }
        if(clicked === true) {
            window.location.reload();
        }

        statusInfo.innerHTML = `${scriptDesc} | Analysis complete, ${productsQueue.length} of ${productButtons.length} items queued, polling ...`;

        // Initialize polling interval for each product currently queued
        // Stop polling either when queue pops or element doesn't exist (unloaded)
        for(const queued of productsQueue) {
            let intervalID = setInterval(async function() {
                const nowAvailable = buttonClickable(queued.button);
                if(nowAvailable === true) { // queue popped, add to cart
                    statusInfo.innerHTML = `${scriptDesc} | Add button detected and clicked (hopefully everything works fine)!`;

                    // Click button, play audio, and open cart window
                    queued.button.click();
                    audio.play();

                    // Force reload since most convenient
                    await new Promise(r => setTimeout(r, 1500));
                    window.location.reload();
                }
            }, scriptConfig.pollInterval * 1000);
        }
    });
}());