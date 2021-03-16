const scriptText = "Best Buy (Cart Saved Items) v2.0.0 | Albert Sun / akito#9528";
const messageText = "Thank you and good luck! | https://github.com/albert-sun/bestbuy-queue-automation";

generateInterface(scriptText, messageText);
const settingsDiv = generateWindow(
    "https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_settings_48px-512.png",
    "Settings",
    400,
    400
);
const loggingDiv = generateWindow(
    "https://cdn2.iconfinder.com/data/icons/font-awesome/1792/code-512.png",
    "Debug Logging",
    800,
    400
);

const func = designateLogging(loggingDiv);
setInterval(function() {
    func("woo")
}, 500);