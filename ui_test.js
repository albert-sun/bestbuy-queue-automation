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

const settings = {
    keepPolling: {description: "Keep Polling", type: "boolean", value: false},
    initialClick: {description: "Initial Click", type: "boolean", value: false},
    soldOutReload: {description: "Sold Out Reload", type: "boolean", value: false},
    pollInterval: {description: "Polling Interval", type: "number", value: 500},
    initialDelay: {description: "Initial Delay", type: "number", value: 500},
    soldOutDelay: {description: "Sold Out Delay", type: "number", value: 60000},
} 

const func = designateLogging(loggingDiv);
setInterval(function() {
    console.log(settings.a)
    func("woo")
}, 500);
designateSettings(settingsDiv, settings);