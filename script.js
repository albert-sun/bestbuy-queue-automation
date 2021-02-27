// ==UserScript==
// @name         Best Buy Queue Automation
// @namespace    akito
// @version      1.7.1
// @description  Auto-presses drops when button changes to Add
// @author       akito#9528
// @match        https://www.bestbuy.com/*skuId=*
// @match        https://www.bestbuy.com/site/combo/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

// Version Changelog
// 1.6.0 - Changed polling to be on set interval instead of on mutation (now it works!)
// 1.6.1 - Very minor changes so that hopefully banner stays on one line?
// 1.7.0 - Added initial click functionality for automatic clicking on page load
// 1.7.1 - Moved notification sound retrieval to page load so it would play correctly

const title = "Best Buy (Product Details) Automation by akito#9528 / Albert Sun";
const donationText = "Thank you! | Bitcoin: bc1q6u7kalsxunl5gleqcx3ez4zn6kmahrsnevx2w4 / 1KgcytPHXNwboNbXUN3ZyuASDZWt8Qcf1t | Paypal: akitocodes@gmail.com";

// Script configuration for editing purposes
const config = {
    keepPolling:  false, // Whether to keep polling on page once item is added to cart          | Default: false
    initialClick: true,  // Whether to click the initial "Add to Cart" button upon loading page | Default: true
    pollInterval: 500,   // In milliseconds, interval between button pollign for availability   | Default: 500
    initDelay:    500,   // In milliseconds, interval before initially clicking the add button  | Default: 500

    // Keyword whitelist for initial clicking, delete or make empty array to ignore.
    // Default: ["3060", "3070", "3080", "3090", "6800", "6900", "5600X", "5800X", "5900X", "5950X", "PS5"]
    keywords: ["3060", "3070", "3080", "3090", "6800", "6900", "5600X", "5800X", "5900X", "5950X", "PS5"]
}

// Quick dirty function which checks the rendered button color for availability.
function buttonAvailable(button) {
    return window.getComputedStyle(button, null).getPropertyValue("background-color").startsWith("rgb(255");
}

// main function body
(function() {
    'use strict'; // necessary?

    // initialize bottom status + donation banner
    const banner = document.createElement("div");
    banner.style.position = "fixed"; banner.style.bottom = "0px"; banner.style.zIndex = 100;
    banner.style.width = "100%"; banner.style.padding = "4px"; banner.style.textAlign = "center";
    banner.style.backgroundImage = "linear-gradient(to right, coral, crimson, coral, crimson)";
    banner.style.fontFamily = "Verdana"; banner.style.fontSize = "12px";
    banner.style.display = "flex"; banner.style.flexDirection = "row"; banner.style.justifyContent = "space-between";
    banner.style.alignItems = "center";

    // initialize left status banner
    let statusInfo = document.createElement("div");
    statusInfo.style.textAlign = "left"; statusInfo.style.paddingLeft = "10px";
    statusInfo.style.order = 0; statusInfo.style.flexBasis = "50%"; // set as child, index 0, 1/4 size
    statusInfo.innerText = `${title} | Initializing script`;
    banner.appendChild(statusInfo);

    // initialize right donation banner
    let donationInfo = document.createElement("div");
    donationInfo.style.textAlign = "right"; donationInfo.style.paddingRight = "10px";
    donationInfo.style.order = 1; donationInfo.style.flexBasis = "50%"; // set as child, index 0, 1/4 size
    donationInfo.innerText = donationText;
    banner.appendChild(donationInfo);

    // Mutation Observer to detect HTML changes to the "Add to Cart" / "Please Wait" button
    // The script waits until the button color changes from grey (Please Wait) back to yellow (Add to Cart).
    // At that point, it clicks the button, plays a fancy notification sound, and opens a new window with express checkout.
    document.addEventListener("DOMContentLoaded", async function() {
        document.body.append(banner); // add banner to DOM
        const audio = new Audio("https://proxy.notificationsounds.com/notification-sounds/definite-555/download/file-sounds-1085-definite.mp3");

        // check current product status (available, sold out, waiting)
        const cartButton = document.getElementsByClassName("add-to-cart-button")[0];
        const soldOut = cartButton.classList.contains("btn-disabled"); // disabled button
        let initAvailable = buttonAvailable(cartButton);
        statusInfo.innerHTML = soldOut ? `${title} | Product currently sold out, script non-functioning`
            : initAvailable ? `${title} | Add button clickable, please click to initialize product queue`
            : `${title} | Existing product queue detected, waiting for button availability change`;
        if(soldOut) { // don't run script on sold out products
            return;
        }

        // delay for initial button clicking if setting enabled.
        if(initAvailable === true && config.initialClick === true && config.keywords !== undefined && config.keywords !== []) {
            const productName = document.getElementsByTagName("title")[0].innerText;

            // check whether the product name contains any of the given keywords
            let hasKeyword = false;
            for(const word of config.keywords) {
                if(productName.includes(word)) {
                    hasKeyword = true;

                    break;
                }
            } // only process click if keyword found
            if(hasKeyword === true) {
                setTimeout(function() {
                    cartButton.click()
                }, config.initDelay);
            }
        }

        // periodic polling for current button color every Xms.
        let intervalID = setInterval(function() {
            let currentAvailable = buttonAvailable(cartButton);
            console.log(window.getComputedStyle(cartButton, null).getPropertyValue("background-color"), initAvailable, currentAvailable);
            if(initAvailable === true && currentAvailable === false) {
                // button clicked to enter queue (yellow => grey)
                statusInfo.innerHTML = `${title} | Queue entry detected, waiting for button availability change`;

                initAvailable = false;
            } else if(initAvailable === false && currentAvailable === true) { // product now available from queue
                // product avialable (grey => yellow)
                statusInfo.innerHTML = `${title} | Availability change detected, button clicked and window opened! Good luck!`;

                // click button, play audio, and open window
                cartButton.click();
                window.open("https://www.bestbuy.com/checkout/r/fast-track");
                audio.play();

                // clear polling if chosen
                if(config.keepPolling === false) {
                    clearInterval(intervalID);
                }
            }
        }, config.pollInterval);
    });
}());
