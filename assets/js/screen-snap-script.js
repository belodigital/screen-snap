/**************************************
 * Puppeteer Script for Automated Screenshots
 *
 * This script provides two modes for taking screenshots:
 * 1. Single Screenshot Mode: Capture a screenshot of a single web page.
 * 2. Batch Screenshot Mode: Capture screenshots for multiple web pages.
 **************************************/

/**************************************
 * Command Line Arguments
 **************************************

/* ----------------------------- */
/*        Required Parameters     */
/* ----------------------------- */
// Batch Mode:
//   --data       : JSON array containing URLs and filenames for screenshots.
//                 Example: '[{"url": "https://example.com/page1", "fileName": "page1.png"}, {"url": "https://example.com/page2", "fileName": "page2.png"}]'
//                 
//                 Optionally, it can also have steps to reproduce before taking the screenshot : JSON array of steps to reproduce on the page before taking a screenshot.
//                 Example: '[{"action": "click", "selector": "button"}, {"action": "fillField", "selector": "#input", "value": "text"}]'

// OR

// Single Screenshot Mode:
//   --url        : The URL of the page to capture.
//   --fileName   : The name of the file to save the screenshot as (e.g., "page.png").
//   [Optional] --stepsToReproduce : JSON array of steps to reproduce on the page before taking a screenshot.
//                                  Example: '[{"action": "click", "selector": "button"}, {"action": "fillField", "selector": "#input", "value": "text"}]'

/* ----------------------------- */
/*       Optional Parameters      */
/* ----------------------------- */
// Save Directory:
//   --savePath   : Custom directory to save screenshots (e.g., "./screenshots"). Defaults to current directory if not provided.

/* ----------------------------- */
/*       Login Parameters         */
/* ----------------------------- */
// If login is required before capturing a screenshot, provide the following:
//   --loginUrl                     : The URL of the login page.
//   --loginUsername                 : The username for login.
//   --loginPassword                 : The password for login.
//   --loginUsernameFieldSelector    : CSS selector for the username input field.
//   --loginPasswordFieldSelector    : CSS selector for the password input field.
//   --loginSubmitButtonSelector     : CSS selector for the submit button on the login form.

/* ----------------------------- */
/*        Additional Options      */
/* ----------------------------- */
// Timeout for page navigation:
//   --pageNavigationTimeout : Maximum time (in milliseconds) to wait for page navigation (default: 30000 ms).

// Screenshot dimensions:
//   --screenshotWidth       : Width of the screenshot (default: 1920 px).
//   --screenshotHeight      : Height of the screenshot (default: 1080 px).

/**************************************
 * Usage Instructions
 **************************************

 1. Single Screenshot Mode:
      Run:
        node script.js --url="https://example.com/page" --fileName="page.png" --savePath="./screenshots"
      Required arguments:
        --url        : The URL of the page to capture.
        --fileName   : The name of the file to save the screenshot (e.g., "page.png").
      Optional argument:
        --savePath   : Directory to save the screenshot (default is the current directory).

 2. Batch Screenshot Mode:
      Run:
        node script.js --data='[{"url": "https://example.com/page1", "fileName": "page1.png"}, {"url": "https://example.com/page2", "fileName": "page2.png"}]' --savePath="./screenshots"
      Required argument:
        --data       : JSON array of URLs and filenames for batch screenshot processing.
      Optional argument:
        --savePath   : Directory to save screenshots (default is the current directory).

 3. Login (if required for page access):
      Run:
        node script.js --url="https://example.com/page" --fileName="page.png" --loginUrl="https://example.com/login" --loginUsername="user@example.com" --loginPassword="password123" --loginUsernameFieldSelector="#username" --loginPasswordFieldSelector="#password" --loginSubmitButtonSelector="#loginButton"
      Required arguments for login:
        --loginUrl                     : The URL of the login page.
        --loginUsername                 : Username for login.
        --loginPassword                 : Password for login.
        --loginUsernameFieldSelector    : CSS selector for the username input field.
        --loginPasswordFieldSelector    : CSS selector for the password input field.
        --loginSubmitButtonSelector     : CSS selector for the submit button.

 4. Additional Optional Arguments:
      --pageNavigationTimeout          : Timeout for page navigation in milliseconds (default: 30000 ms).
      --screenshotWidth                : Width of the screenshot (default: 1920 px).
      --screenshotHeight               : Height of the screenshot (default: 1080 px).


/**************************************/

/* ------------------------ */
/*    Initialization        */
/* ------------------------ */

const puppeteer = require("puppeteer");
const path = require("path");

/* ------------------------ */
/*    Default Configurations */
/* ------------------------ */

// Default dimensions for screenshots
const defaultScreenshotWidth = 1920;
const defaultScreenshotHeight = 1080;

// Default page navigation timeout in milliseconds
const defaultPageNavigationTimeout = 30000;

/* ------------------------ */
/*  Command Line Arguments   */
/* ------------------------ */

const args = getArguments();

// Login credentials
const loginCredentials = {
    url: args.loginUrl,
    username: args.loginUsername,
    password: args.loginPassword,
};

// Login form field selectors
const loginFormFieldsSelectors = {
    email: args.loginUsernameFieldSelector,
    password: args.loginPasswordFieldSelector,
    submitButton: args.loginSubmitButtonSelector,
};

// Screenshot settings and save path
const pageNavigationTimeout =
    args.pageNavigationTimeout || defaultPageNavigationTimeout;
const screenshotWidth = args.screenshotWidth || defaultScreenshotWidth;
const screenshotHeight = args.screenshotHeight || defaultScreenshotHeight;
const savePath = args.savePath;

// Single screenshot parameters
const url = args.url;
const fileName = args.fileName;
var stepsToReproduce = null;
if (args.stepsToReproduce) {
    stepsToReproduce = parseJson(args.stepsToReproduce);
}

// Batch data parsing
var data = null;
if (args.data) {
    data = parseJson(args.data);
}

// Variable to track if login is required
var performLogin = false;

// Flag to track the first iteration for the progress bar
var isFirstIteration = true;

/* ------------------------ */
/*    Utility Functions      */
/* ------------------------ */

/**
 * Parses command line arguments and returns them as an object.
 * @returns {Object} A key-value pair of command line arguments.
 */
function getArguments() {
    const args = process.argv.slice(2);
    const argObject = {};

    args.forEach((arg) => {
        const equalIndex = arg.indexOf("=");
        if (equalIndex > -1) {
            const key = arg.slice(0, equalIndex).replace("--", "");
            const value = arg.slice(equalIndex + 1); // Extract value after '='
            argObject[key] = value;
        }
    });

    return argObject;
}

/**
 * Verifies the presence of required parameters and checks if login credentials are provided.
 */
function verifyParameters() {
    if (!savePath) {
        console.error("Missing parameter: --savePath.");
        process.exit(1);
    }

    if (
        loginCredentials.url &&
        loginCredentials.username &&
        loginCredentials.password &&
        loginFormFieldsSelectors.email &&
        loginFormFieldsSelectors.password &&
        loginFormFieldsSelectors.submitButton
    ) {
        performLogin = true; // Enable login process if all login parameters are provided
    }
}

/**
 * The function `parseJson` attempts to parse a JSON string and logs an error
 * message if parsing fails.
 * @param json - The `parseJson` function is designed to parse a JSON string into a
 * JavaScript object. If the JSON parsing fails due to invalid JSON syntax, it will
 * log an error message and exit the process with a status code of 1.
 * @returns The `parseJson` function returns the parsed JSON object if the parsing
 * is successful. If there is an error during parsing, it logs an error message and
 * exits the process with an error code.
 */
function parseJson(json) {
    try {
        return JSON.parse(json);
    } catch (error) {
        console.error("Error parsing JSON:", error.message);
        process.exit(1); // Exit if invalid JSON is provided
    }
}

/**
 * Performs login on the page by entering the credentials and submitting the form.
 * @param {Object} page - Puppeteer Page object representing the current browser tab.
 */
async function login(page) {
    try {
        // Enter email and password
        await page.type(
            loginFormFieldsSelectors.email,
            loginCredentials.username
        );
        await page.type(
            loginFormFieldsSelectors.password,
            loginCredentials.password
        );

        // Submit the form and wait for navigation
        await Promise.all([
            page.click(loginFormFieldsSelectors.submitButton),
            page.waitForNavigation({ waitUntil: "networkidle2" }),
        ]);
    } catch (error) {
        throw "Error logging in: " + error.message;
    }
}

/**
 * Checks if login is required by looking for the email input field on the page.
 * @param {Object} page - Puppeteer Page object representing the current browser tab.
 * @returns {Boolean} Returns true if login is required, otherwise false.
 */
async function isLoginRequired(page) {
    try {
        // Check if the login form's email input exists on the page
        return (await page.$(loginFormFieldsSelectors.email)) !== null;
    } catch (error) {
        throw "Error checking login page: " + error.message;
    }
}

/**
 * The `reproduceSteps` function in JavaScript iterates through a list of steps to
 * reproduce on a web page, such as clicking elements or filling fields.
 * @param page - The `page` parameter in the `reproduceSteps` function is typically
 * a reference to the Puppeteer Page object. This object represents a single tab or
 * window in a browser controlled by Puppeteer. You can perform various actions on
 * this page object, such as navigating to URLs, interacting with elements on
 * @param stepsToReproduce - An array of objects containing the steps to reproduce.
 * Each object should have the following properties:
 */
async function reproduceSteps(page, stepsToReproduce) {
    try {
        for (const step of stepsToReproduce) {
            // await page.waitForSelector(step.selector);
            const element = await page.waitForSelector(step.selector);

            switch (step.action) {
                case "click":
                    // await page.click(step.selector);
                    await element.click();
                    break;
                case "fillField":
                    // await page.type(step.selector, step.value);
                    await element.type(step.value);
                    break;
                default:
                    throw (
                        ("Error reproducing steps:",
                        "Unknown action:",
                        step.type)
                    );
            }
        }
    } catch (error) {
        throw ("Error reproducing steps:", error);
    }
}

/**
 * Takes a screenshot of the specified URL, performing login if required.
 * @param {Object} page - Puppeteer Page object representing the current browser tab.
 * @param {String} url - The URL to navigate to for the screenshot.
 * @param {String} fileName - The file name to save the screenshot as.
 */
async function takeScreenshot(page, url, stepsToReproduce, fileName) {
    try {
        // Navigate to the target page
        await page.goto(url, {
            waitUntil: "networkidle2",
            timeout: pageNavigationTimeout,
        });

        // Check and perform login if required
        if (performLogin && (await isLoginRequired(page))) {
            await login(page); // Perform login

            // Optionally, navigate back to the target page after login
            // await page.goto(url, { waitUntil: "networkidle2", timeout: defaultTimeout });
        }

        if (stepsToReproduce) {
            await reproduceSteps(page, stepsToReproduce);
        }

        if(!fileName) {
            fileName = "screenshot" + getRandomInt(1, 10) + ".png";
        }

        // Capture screenshot
        await page.screenshot({
            path: path.join(savePath, fileName),
            fullPage: true,
        });
    } catch (error) {
        throw "Error taking screenshot '" + fileName + "': " + error.message;
    }
}

/* ------------------------ */
/*      Aux Functions       */
/* ------------------------ */

/**
 * The getRandomInt function generates a random integer within a specified range.
 * @param min - The `min` parameter represents the minimum value of the range from
 * which you want to generate a random integer.
 * @param max - The `max` parameter in the `getRandomInt` function represents the
 * maximum value that you want the random integer to be generated within.
 * @returns The function getRandomInt(min, max) returns a random integer between
 * the specified minimum (min) and maximum (max) values.
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

/* ------------------------ */
/*    Screenshot Handlers    */
/* ------------------------ */

/**
 * Handles the process of taking a single screenshot.
 */
async function handleSingleScreenshot() {
    let browser;
    try {
        browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        await page.setViewport({
            width: screenshotWidth,
            height: screenshotHeight,
        });

        await takeScreenshot(page, url, stepsToReproduce, fileName);

        console.log("Screenshot process completed successfully.");
    } catch (error) {
        console.error("Screenshot process failed:", error);
        process.exit(1);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

/**
 * Handles the process of taking screenshots in batch mode for multiple URLs.
 */
async function handleBatchScreenshots() {
    let browser;
    let counter = 0;
    let countSuccess = 0;
    let countError = 0;

    try {
        browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        await page.setViewport({
            width: screenshotWidth,
            height: screenshotHeight,
        });

        // Iterate over each URL in the batch data
        for (const item of data) {
            counter++;
            try {
                await takeScreenshot(page, item.url, item.stepsToReproduce, item.fileName);
                countSuccess++;
            } catch (error) {
                countError++;
                console.error(
                    "Error processing URL '" + item.url + "':",
                    error,
                    "\n"
                );
            }

            // Update progress bar for each iteration
            progressBar(counter, data.length);
        }
    } catch (error) {
        console.log("Batch process failed:", error.message);
    } finally {
        if (browser) {
            await browser.close();
        }

        // Ensure final progress bar reflects 100% completion
        progressBar(counter, data.length);

        console.log(
            "Total URLs processed:",
            counter,
            "\nSuccess:",
            countSuccess,
            "\nErrors:",
            countError
        );
    }
}

/* ------------------------ */
/*    Progress Bar Function  */
/* ------------------------ */

/**
 * Updates the console with a progress bar reflecting the current completion percentage.
 * @param {Number} completed - The number of completed tasks.
 * @param {Number} total - The total number of tasks to complete.
 */
function progressBar(completed, total) {
    const percentage = Math.round((completed / total) * 100);
    const barLength = 15;
    const filledLength = Math.round((percentage / 100) * barLength);

    const bar = "█".repeat(filledLength) + "░".repeat(barLength - filledLength);
    const completeBar = `Snapping screens: ${bar} ${percentage}%\n`;

    if (process.stderr.isTTY) {
        if (!isFirstIteration) {
            // Skip moving the cursor up on the first iteration
            process.stderr.moveCursor(0, -1);
        } else {
            isFirstIteration = false;
        }

        process.stderr.clearLine();
        process.stderr.cursorTo(0);
        process.stderr.write(completeBar);
    } else {
        // Fallback for environments without clearLine/cursorTo support
        console.error(completeBar);
    }
}

/* ------------------------ */
/*    Main Execution         */
/* ------------------------ */

/**
 * Main function that decides whether to run single or batch screenshot mode.
 */
async function main() {
    verifyParameters();

    if (data) {
        await handleBatchScreenshots();
    } else if (url) {
        await handleSingleScreenshot();
    } else {
        console.error(
            "Error: Provide --url or --data (array of URLs in JSON format)."
        );
        process.exit(1);
    }
    process.exit(0);
}

main();