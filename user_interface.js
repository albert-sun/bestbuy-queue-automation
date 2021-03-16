let footer; // Footer containing all icons and statuses
let windowIndex = 0; // Index of generated window
const statuses = []; // Window open statuses (true / false)
const selectors = []; // Window elements for sliding

// Displayed windows slideToggle control ensuring only one window at a time is shown.
// Faster sliding transition when closing previous window when new window is being opened.
function windowControl(index) {
    if(statuses[index] === true) { // Window currently open, close it
        statuses[index] = !statuses[index]; // Open -> closed
        selectors[index].slideToggle(400);
    } else { // Window currently closed
        // Close any windows currently open (should be one max)
        for(const ind in statuses) {
            if(statuses[ind] === true) {
                statuses[ind] = !statuses[ind];; // Open -> closed
                selectors[ind].slideToggle(200);
            }
        }

        statuses[index] = !statuses[index]; // Closed -> open
        selectors[index].slideToggle(400);
    }
};

// Generate red-orange header with text, pretty simple.
// @param {string} text
// @returns {DOMElement}
function generateHeader(text) {
    // Generate header wrapper element
    const header = document.createElement("div");
    header.classList.add("akito-header");

    // Generate div containing actual text
    const headerText = document.createElement("p");
    header.appendChild(headerText);
    headerText.classList.add("akito-headerTitle");
    headerText.innerText = text;

    return header;
}

// Generates and adds footer icon and window, and automates setting management if settingsInfo is not undefined.
// Window is added to slide controller, and global icon and window offset are incremented per initialization.
// @param {string} iconURL
// @param {string} title
// @param {number} width
// @param {number} height
// @param (optional) {Object} settingsInfo
function generateWindow(iconURL, title, width, height, settingsInfo) {
    // Check whether footer has even been initialized
    if(footer === undefined) {
        throw 'Footer has not been initialized yet!';
    }

    // Increment all flexbox orders in advance
    const placeIndex = footer.children.length - 2;
    for(const element of footer.children) {
        if(element.tagName !== "a") { // script info or donation
            element.style.order++;
        }
    }

    // Initialize a element for window toggle and add to footer
    const iconClick = document.createElement("a");
    const index = windowIndex++; // Copy constant for onclick
    footer.insertBefore(iconClick, footer.children[footer.children.length - 2]); // doesn't matter because order
    iconClick.classList.add("akito-iconClick");
    iconClick.classList.add(`akito-icon${placeIndex}`);
    iconClick.href = "#";
    iconClick.onclick = function() {
        windowControl(index);
        return false;
    }; // Toggle window with given index

    // Initialize icon for window toggle "button"
    const iconImage = document.createElement("img");
    iconClick.appendChild(iconImage);
    iconImage.classList.add("akito-iconImage");
    iconImage.src = iconURL;

    // Initialize actual window with given width, height, and left offset
    const thisWindow = document.createElement("div");
    thisWindow.classList.add("akito-window");
    // Best Buy doesn't let me set the left property that's so stupid
    statuses[index] = false;
    selectors[index] = $(thisWindow);

    // Initialize window header with title
    const header = generateHeader(title);
    thisWindow.appendChild(header);

    // Initialize content div with scroll bar
    const contentDiv = document.createElement("div");
    thisWindow.appendChild(contentDiv);
    contentDiv.classList.add("akito-windowContent");

    // Add to document body and retrieve selector when loaded
    $(document).ready(function() {
        document.body.appendChild(thisWindow);
        $(thisWindow).hide(); // Best Buy forcing me to initially hide?
        new SimpleBar(contentDiv);
    });

    return contentDiv;
}

// Generates page footer for script user interface (script info and other elements)
// @param {string} scriptText
// @param {string} messageText
function generateInterface(scriptText, messageText) {
    // Full-width footer containing script controls and output
    footer = document.createElement("div");
    footer.classList.add("akito-footer");

    // Script name/version/author information
    const scriptInfo = document.createElement("p");
    footer.appendChild(scriptInfo);
    scriptInfo.classList.add("akito-scriptInfo");
    scriptInfo.style.order = 0;
    scriptInfo.innerText = "Best Buy (Cart Saved Items) v2.0.0 | Albert Sun / akito#9528";

    // Miscellaneous message info (donation, link, etc.)
    const messageInfo = document.createElement("p");
    footer.appendChild(messageInfo);
    messageInfo.classList.add("akito-messageInfo");
    messageInfo.style.order = 1;
    messageInfo.innerHTML = "Thank you and good luck! | https://github.com/albert-sun/bestbuy-queue-automation";

    // Append elements and process selectors on document load
    $(document).ready(function() {
        document.body.appendChild(footer);
    });
}

// Designates div for logging and generates table appending function
// @param {DOMElement} contentDiv
// @returns {function}
function designateLogging(contentDiv) {
    const loggingTable = document.createElement("table");
    contentDiv.appendChild(loggingTable);
    loggingTable.classList.add("akito-loggingTable");

    // Generates timestamp and appends to logging table
    // @param {string} message
    return function(message) {
        const row = document.createElement("tr");

        // Generate timestamp cell
        const timestamp = "[" + (new Date()).toISOString().substring(11, 19) + "]";
        const loggingCell = document.createElement("td");
        row.appendChild(loggingCell);
        loggingCell.innerText = `${timestamp} ${message}`;

        loggingTable.insertBefore(row, loggingTable.firstChild);
    }
}