// ==UserScript==
// @name         Best Buy Queue Automation
// @namespace    akito
// @version      1.5.0
// @description  Auto-presses drops when button changes to Add
// @author       akito#9528
// @match        https://www.bestbuy.com/*skuId=*
// @match        https://www.bestbuy.com/site/combo/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

// Version Changelog
// 1.4.0 - Changed workings to check for aria-described-by for overlay?
// 1.5.0 - Changed workings to check rendered button color, hopefully works now
// 1.6.0 - Changed polling to be on set interval instead of on mutation (now it works!)

const title = "Best Buy (Product Details) Automation by akito#9528";
const keepChecking = false; // Whether to keep polling on page once item is added to cart        | Default: false
const pollInterval = 500;   // In milliseconds, interval between button pollign for availability | Default: 500

// Quick dirty function which checks the rendered button color for availability.
function buttonAvailable(button) {
    return window.getComputedStyle(button, null).getPropertyValue("background-color").startsWith("rgb(255");
}

// main function body
(function() {
    'use strict'; // necessary?

    // initialize bottom status banner
    let banner = document.createElement("div");
    banner.style.position = "fixed"; banner.style.bottom = "0px"; banner.style.zIndex = 100;
    banner.style.width = "100%"; banner.style.padding = "4px"; banner.style.textAlign = "center";
    banner.style.backgroundImage = "linear-gradient(to right, coral, crimson, coral, crimson)";
    banner.innerHTML = `${title} | Initializing script`;

    // Mutation Observer to detect HTML changes to the "Add to Cart" / "Please Wait" button
    // The script waits until the button color changes from grey (Please Wait) back to yellow (Add to Cart).
    // At that point, it clicks the button, plays a fancy notification sound, and opens a new window with express checkout.
    // > Note: untested on actual drops, only manually tested by manually changing the HTML
    // > Note: only tested on changing of element's classes, unsure if changes within a class cause mutation
    document.addEventListener("DOMContentLoaded", async function() {
        document.body.append(banner); // add banner to DOM

        // check current product status (available, sold out, waiting)
        const cartButton = document.getElementsByClassName("add-to-cart-button")[0];
        const soldOut = cartButton.classList.contains("btn-disabled"); // disabled button
        let initAvailable = buttonAvailable(cartButton);
        banner.innerHTML = soldOut ? `${title} | Product currently sold out, script non-functioning`
            : initAvailable ? `${title} | Add button clickable, please click to initialize product queue`
            : `${title} | Existing product queue detected, waiting for button availability change`;
        if(soldOut) { // don't run script on sold out products
            return;
        }

        let intervalID = setInterval(function() {
            let currentAvailable = buttonAvailable(cartButton);
            console.log(window.getComputedStyle(cartButton, null).getPropertyValue("background-color"), initAvailable, currentAvailable);
            if(initAvailable === true && currentAvailable === false) {
                // button clicked to enter queue (yellow => grey)
                banner.innerHTML = `${title} | Queue entry detected, waiting for button availability change`;

                initAvailable = false;
            } else if(initAvailable === false && currentAvailable === true) { // product now available from queue
                // product avialable (grey => yellow)
                banner.innerHTML = `${title} | Availability change detected, button clicked and window opened! Good luck!`;

                // click button, play audio, and open window
                cartButton.click();
                window.open("https://www.bestbuy.com/checkout/r/fast-track");
                const audio = new Audio("https://proxy.notificationsounds.com/notification-sounds/definite-555/download/file-sounds-1085-definite.mp3");
                audio.play();

                // clear polling if chosen
                if(keepChecking === false) {
                    clearInterval(intervalID);
                }
            }
        }, pollInterval);
    });
}());
