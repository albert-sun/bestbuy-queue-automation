// ==UserScript==
// @name         Best Buy Automation (Cart Saved Items)
// @namespace    akito
// @version      2.0.0
// @description  Auto-presses drops when button changes to Add
// @author       akito#9528 / Albert Sun
// @updateURL    https://raw.githubusercontent.com/albert-sun/bestbuy-queue-automation/main/script_cart.js
// @downloadURL  https://raw.githubusercontent.com/albert-sun/bestbuy-queue-automation/main/script_cart.js
// @require      https://raw.githubusercontent.com/albert-sun/bestbuy-queue-automation/main/utilities.js
// @match        https://www.bestbuy.com/cart
// @run-at       document-start
// @grant        none
// ==/UserScript==
/* globals $, callbackArray, callbackObject, checkBlackWhitelist, edgeDetect, elementColor */

// Version Changelog
// 1.0.2 - Added update and download URL to metadata, go to Tampermonkey settings -> enable "Check Interval" for auto-updating
// 1.1.0 - Added primite adblock detection to notify users, keyword blacklist, more config settings, and non-refresh method when adding to cart
// 2.0.0 - Complete fancy script overhaul adding primitive adblock detection and notification and removal of auto page-refreshing on actions (it was alot of work...)

// Script configuration
const scriptConfig = {
    checkAdblock: true, // Whether to primitively check for adblock and notify if found (causes website issues)
    colorInterval: 1000, // In milliseconds, interval between updating buttons color for callback
    keyWhitelist: ["3060", "3070", "3080", "3090", "6800", "6900", "5600X", "5800X", "5900X", "5950X", "PS5"], // Whitelist keywords for products
    keyBlacklist: [], // Blacklist keywords for products (blacklist > whitelist)
    audioURL: "https://proxy.notificationsounds.com/notification-sounds/definite-555/download/file-sounds-1085-definite.mp3", // Notification sound URL, feel free to change!
    // /!\  You probably shouldn't edit the values below unless you know what you're doing  /!\
    errorDelay: 250, // In milliseconds, delay before reloading saved item elements when error detected
    cartCheckDelay: 250, // In milliseconds, delay before checking for cart removed message on cart modification callback
    cartSkipDelay: 5000, // In milliseconds, delay when skipping waiting for unload on cart item removal callback
    loadUnloadDelay: 50, // In milliseconds, delay between periodic polling for loading and unloading saved item elements
};

// Variables for script usage, don't modify unless you know what you're doing
const version = "2.0.0";
const scriptDesc = `Best Buy Automation (Cart Saved Items) v${version} by akito#9528 / Albert Sun`;
const donationText = "Thank you! | Bitcoin: bc1q6u7kalsxunl5gleqcx3ez4zn6kmahrsnevx2w4 / 1KgcytPHXNwboNbXUN3ZyuASDZWt8Qcf1t | Paypal: akitocodes@gmail.com";
const storage = {
    buttons: {}, //_________ mapping SKU -> add button elements
    colors: {}, //__________ mapping SKU -> current button color
    descriptions: {}, //____ mapping SKU -> product description
    intervalIDs: {}, //_____ mapping SKU -> setInterval IDs
}; // Dedicated storage variable for script usage
const adblockURLs = [
    "https://pubads.g.doubleclick.net/ssai/event/",
    "https://googleads.g.doubleclick.net/pagead/html/",
    "https://online-metrix.net/",
]; // Test request URLs for detecting adblock status
const audio = new Audio(scriptConfig.audioURL);

// Called on cart change, clear storage and re-retrieve saved items HTMl attributes.
// Saved item elements are unloaded and reloaded with identical but different instances.
// On initial page load, skipUnload = true to skip element unloading polling.
// @param {boolean} skipUnload
// @param {boolean} fromCart
async function resetSaved(skipUnload, fromCart) {
    // Clear existing queue polling intervals
    // Then, clear storage attributes by resetting to empty object
    for(const sku in storage.intervalIDs) {
        clearInterval(storage.intervalIDs[sku]);
    }
    storage.buttons = {};
    storage.colors = {};
    storage.descriptions = {};
    storage.intervalIDs = {};

    // Periodically poll until saved items unload and reload
    let savedWrappersRes;
    if(fromCart) { await new Promise(r => setTimeout(r, scriptConfig.cartCheckDelay)); } // Extra wait, for cart or something idek anymore
    if($(".removed-item-info__wrapper")[0] === undefined) { // Wait instead of polling for removed
        do { // Wait for existing saved items elements to unload
            savedWrappersRes = $(".saved-items__card-wrapper");
            await new Promise(r => setTimeout(r, scriptConfig.loadUnloadDelay));
        } while(savedWrappersRes.length !== 0 && skipUnload === false);
    } else { // Weird edge case where elements never truly "disappear", wait instead
        await new Promise(r => setTimeout(r, scriptConfig.cartSkipDelay));
    }
    do { // Wait for "new" saved items elements to load
        savedWrappersRes = $(".saved-items__card-wrapper");
        await new Promise(r => setTimeout(r, scriptConfig.loadUnloadDelay));
    } while(savedWrappersRes.length === 0);

    // Convert selector result and parse other elements
    const savedSKUs = savedWrappersRes.toArray().map(element => element.getAttribute("data-test-saved-sku"));
    const descriptionElements = $(".saved-items__card-wrapper .simple-item__description").toArray();
    const savedDescriptions = descriptionElements.map(element => element.innerText);
    const savedButtons = $(".saved-items__card-wrapper .btn.btn-block").toArray();

    // Parse keywords of each and splice those with blacklisted or without whitelisted
    let index = savedDescriptions.length;
    while(index--) { // Loop in reverse to allow splicing
        const description = savedDescriptions[index];
        const valid = checkBlackWhitelist(description, scriptConfig.keyBlacklist, scriptConfig.keyWhitelist);
        if(valid === false) { // Check whether the saved item is allowed
            savedSKUs.splice(index, 1);
            savedDescriptions.splice(index, 1);
            savedButtons.splice(index, 1);
        }
    }

    // Iterate through buttons and deduce whether addable, queued, or unavailable
    // If addable, click the button (hopefully error element detector callback triggers)
    // If queued, store relevant info, initiate setInterval, and initiate edge detection
    for(const index in savedButtons) {
        const button = savedButtons[index];
        const buttonColor = elementColor(button);
        const available = !button.classList.contains("disabled");
        if((buttonColor === "white" || buttonColor === "blue")) { // Addable, should be available?

        } else if(buttonColor === "grey" && available === true) { // Currently queued
            // Store relevant info into storage
            const sku = savedSKUs[index];
            storage.buttons[sku] = button;
            storage.colors[sku] = "grey";
            storage.descriptions[sku] = savedDescriptions[index];

            // Initiate periodic interval for updating element color
            // Remember that intervals are cleared on each resetSaved call
            storage.intervalIDs[sku] = setInterval(function() {
                storage.colors[sku] = elementColor(storage.buttons[sku]);
            }, scriptConfig.colorInterval);

            // Initiate edge detection for callback color changes
            // I think it turns to white? Does it sometimes turn yellow as well?
            edgeDetect(storage.colors, sku, "grey", ["white", "yellow"], function() {
                audio.play();
                button.click();
            });
        }
    }
}

(async function() {
    // Primitive adblock check: attempting to fetch commonly blocked domains
    let adblockDetected = undefined;
    if(scriptConfig.checkAdblock === true) {
        for(const url of adblockURLs) {
            fetch(url).catch(function() { adblockDetected = true; });
        }
    }

    // Setup page banner and initiate runtime when page fully loaded
    // User also notified through alert / banner if adblock detected
    window.addEventListener('DOMContentLoaded', async function() {
        alert("The new version of the script, while tested somewhat thoroughly (checklist at bottom of script) does not currently have a UI and could be glitchy. Revert to https://raw.githubusercontent.com/albert-sun/bestbuy-queue-automation/b792aa9fc72062772baf598f4dca71afb5dc79fa/script_cart.js if you're uncomfortable.")

        // Short delay to allow for adblock probes to finish
        if(scriptConfig.checkAdblock === true) {
            await new Promise(r => setTimeout(r, 1000));
        }

        // Advise user to disable adblock if detected
        if(adblockDetected === true) {
            // Notify the user here somehow
        }

        // Force refresh of saved item elements whenever error detected using jQuery
        // Wait some time interval before refreshing to let auto-clicker finish clicking in runtime
        $(".alerts__order").bind('DOMNodeInserted', async function(e) {
            await new Promise(r => setTimeout(r, scriptConfig.errorDelay));
            await resetSaved(false, false);
        });

        await resetSaved(true, false); // Initial call on page load

        // Force refresh of saved item elements whenever order summary changes (cart addition / removal?)
        // window.cart extraordinarily slippery, unable to hook getters/setters or anything
        // Currently triggers on picking/shipping swaps but don't want custom callback function...
        callbackObject(window.__META_LAYER_META_DATA, "order", function() { resetSaved(false, true) }, "set");
    });
}());

/*
== Current Bugs ==
- Clicking on "Please Wait" breaks periodic interval check
== Current Testing Checklist ==
[X] Adblock detection user notification
[X] Error message element DOM insert callback
[X] Cart addition / removal (/ fulfillment swap) callback
[X] Correct whitelist and blacklist keyword product filtering and splicing
[X] Correct added / queued / unavailable element detection
[X] Dummy queued availability callback (audio + click)
[X] Reset routine on cart addition / removal (/ fulfillment swap)
*/