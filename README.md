# bestbuy-queue-automation
Simple Tampermonkey script for automating Best Buy's product queue.  
**SOMEWHAT UNTESTED, if you're feeling safe feel free to download 1.7.1 [here](https://github.com/albert-sun/bestbuy-queue-automation/tree/ad80072d2ee0d8a96ade54eb1f9d6110fabdbb8e)**

# Frequently Asked Questions
**Q: Does this script work on non-focused tabs / multiple tabs?**
A: The script runs as long as the tab has been focused once (for instance, if you click "Open in new tab" you would have to navigate to the tab). The script also only works during the queue, so make sure to press the initial "Add to Cart" button to initiate the queue (you should see the bottom left status change).  

**Q: How do I know the script is running?**
A: You can either check the TamperMonkey or GreaseMonkey icon (it should have a little red [1] signifying the script is active), or you can check for the red-orange banner at the bottom of the product page. Keep in mind that the script currently only functions on individual product pages and not on search results or the saved items page.

**Q: Can I have both scripts running at the same time?**
A: Yes, the two scripts run on separate sets of pages so you don't have to worry about them conflicting with each other.

# Instructions
Install the script through the TamperMonkey extension for Chrome or the GreaseMonkey extension for Firefox.  
Copy the contents of the below scripts as new scripts into the downloaded extension.  
**The cart script works on the cart page for SAVED ITEMS as an alternative to the saved items page.**  
[Download the product details page script here](https://github.com/albert-sun/bestbuy-queue-automation/blob/main/script_product.js)  
[Download the cart saved items script here](https://github.com/albert-sun/bestbuy-queue-automation/blob/main/script_cart.js)   

- The scripts automatically run on page load (a red-orange banner should appear on the bottom of the page).
- When the queue pops the button will automatically click, play a sound, and either open or refresh the cart window (depending on script)!
