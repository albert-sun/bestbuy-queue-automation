# bestbuy-queue-automation
Simple Tampermonkey scripts for automating Best Buy's product queue.  
# Script Installation
1) Install the TamperMonkey extension for Chrome or the GreaseMonkey extension for Firefox to load and automatically run the scripts on page load.

2) Download either/both of the [product details script](https://raw.githubusercontent.com/albert-sun/bestbuy-queue-automation/main/script_product.js) or the [cart saved items script](https://raw.githubusercontent.com/albert-sun/bestbuy-queue-automation/main/script_cart.js) and add them individually as new scripts to the extension.
   
3) The product details script has page scope of all individual items while the cart saved items script has page scope of ONLY the cart page. **Note that the script does not function on the dedicated saved items page - instead, use the saved items view at the bottom of the cart page.**
   
4) The script also auto-updates depending on your extension settings (TamperMonkey: Dashboard -> Settings -> Script Update under "Check Interval", make sure it's not disabled), or you can manually update by clicking the extension icon and pressing "Check for userscript updates".

# Individual script runtime instructions
|**Script**          |**Instructions**                                       |
|----------------|---------------------------------------------------|
|Product Details |On page load, the script will initially click the Add button for all products containing whitelisted keywords. When the queue pops, the script will automatically press the button, play a notification sound, and open the cart page in a new window for checkout.|
|Cart Saved Items|On page load, the script will parse all saved products. If there are any products not currently queued and addable, the script will click the Add button and refresh the page. When the queue pops, the script will automatically press the button, play a notification sound, and reload the cart page. In the event of multiple items popping simultaneously, the script should (theoretically) keep refreshing and adding items until they're all within the cart.|

# Frequently Asked Questions
**Q: Does this script work on multiple / non-focused tabs?**  
A: The script runs in the background **as long as the tab has been focused once (for instance, if you CTRL+CLICK a link or right click and select "Open in new tab", you would have to navigate to the tab once before clicking away). 

**Q: Can I run the two scripts simultaneously?**  
A: Yes - the two scripts have non-overlapping page scopes which means they won't interfere with each other (though the queue popping on both scripts might cause some issues). It's perfectly fine to have multiple indvidual product pages as well as the cart page open and running the scripts.

**Q: How do I know when the script is running?**  
A: Two methods: you can either check the top right-hand corner of the browser and check the TamperMonkey / GreaseMonkey icon, or you can check the bottom of the page which should show a red-orange banner.

# Miscellaneous Information
Discord contact for support / suggestions / etc: akito#9528  
Bitcoin: 1KgcytPHXNwboNbXUN3ZyuASDZWt8Qcf1t  
Ethereum: 0xAf9EB617c81B050517E9A8826E4c93DcC182AeaD  
[![Donate](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/donate?business=GFVTB9U2UGDL6&currency_code=USD) via PayPal, thanks!