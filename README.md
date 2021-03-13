# Best Buy Queue Automation Userscripts
{ [Installation](<https://github.com/albert-sun/bestbuy-queue-automation#Installation>) | [Scripts](<https://github.com/albert-sun/bestbuy-queue-automation#Scripts>) | [Frequently Asked Questions](<https://github.com/albert-sun/bestbuy-queue-automation#Frequently-Asked-Questions>) | [Troubleshooting](<https://github.com/albert-sun/bestbuy-queue-automation#Troubleshooting>) | [Contact](<https://github.com/albert-sun/bestbuy-queue-automation#Contact>) }  

A collection of Tampermonkey userscripts for automating Best Buy's constrained inventory product queue. Currently only automates cart addition (and other miscellaneous utilities), no plans currently to automate checkout as that would provide too much of an unfair advantage. **Please let me know if you got anything through my scripts, it makes me feel happy knowing that my scripts are at least somewhat useful. Thanks again and good luck!**

**Discord**: akito#9528  
**Twitch (for direct message)**: AkitoApocalypse  
[Donate via PayPal](<https://www.paypal.com/donate?business=GFVTB9U2UGDL6&currency_code=USD>) | [My Bitcoin Address](1KgcytPHXNwboNbXUN3ZyuASDZWt8Qcf1t) | [My Ethereum Address](0xAf9EB617c81B050517E9A8826E4c93DcC182AeaD)

## Installation
1) Install either the TamperMonkey extension for Google Chrome / derivatives or the GreaseMonkey extension for Firefox.
2) Download the desired scripts linked within the [Scripts](<https://github.com/albert-sun/bestbuy-queue-automation#Scripts>) section and add them to TamperMonkey / GreaseMonkey as a new script (for Tampermonkey: click extension icon -> "Create a new script...").
3) Save the script by pressing CTRL+S, then verify its installation by comparing against the list of currently installed userscripts (for Tampermonkey: dashboard -> "Installed userscripts").
4) Script should automatically update depending on the check interval within the extension settings (enabled by default) but I might change the repository name or script filename eventually which will break script updates. **Check this README every now and then if possible, important notices will be pinned at the top.**

## Scripts
|Script|Latest Version|Page Scope|Features|
|----------------|:------------:|------------------------|--------|
|[Product Details](https://github.com/albert-sun/bestbuy-queue-automation/blob/main/script_product.js)|2.0.2|Individual product pages|<ul><li>Automatic interval page reloading for refreshing current status of product, useful for refreshing availability on sold out or unavailable products</li><li>Automatic button clicking for initially entering product queue and when queue pops, along with audio notification and opening of cart window whenever item is successfully added to cart</ul>|
|[Cart Saved Items](https://github.com/albert-sun/bestbuy-queue-automation/blob/main/script_cart.js)|2.0.0|Cart page|<ul><li>Simple adblock detection and notification (having adblock sometimes messes with website functionality)<li>Automatic interval page reloading for refreshing availability on sold out or unavailable products</li><li>Keyword whitelist and blacklist for processing saved items (note that bundles aren't shown on the cart saved items display)</li></li>Automatic button clicking for initially entering product queue and when queue pops, along with audio notification whenever item is successfully added to cart</li></ul>|

## Frequently Asked Questions
**Q: Do scripts work on multiple / non-focused tabs?**  
A: The script automatically runs in the background regardless of whether the tab is currently being focused (unless the page has been unloaded from your browser) **as long as the page has been focused at least once.** This means that if you, for instance, opened a page using CTRL+CLICK or right clicked and selected "Open link in new tab", you would have to navigate to the tab once before clicking away.  

**Q: Can I run multiple scripts simultaneously?**  
A: Yes! All scripts should have different page scopes meaning you should never have multiple scripts running on a single page. However, their functions might overlap if you have multiple of the same tab open or are running two scripts with essentially overlapping functions (for example, both the Best Buy product page and cart scripts).  

**Q: How do I confirm that the script is running?**  
A: Two methods: you can either click the extension icon in the top right-hand corner of the browser and check that the script is enabled (no script shown means not installed) or check the bottom of the page for a red-orange banner showing the script information and status.  

## Troubleshooting
**For Best Buy especially, make sure your adblock is disabled since it oftentimes interferes with website operation (Best Buy goes through some suspicious URLs for fingerprinting and all that).**  

Before coming to me with any questions, please ensure that you are running the most recent version of the installed script and that the script is currently running (read directly above). **If you're still having issues, please contact me via Discord or Twitch DM with the script name, version, and as much information about the problem as possible.**