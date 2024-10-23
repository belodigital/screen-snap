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
//                 Example: '[{"action": "click", "selector": "button"}, {"action": "fillField", "selector": "#input", "value": "text"}, {"action": "wait", "value": "1000"}]'

// OR

// Single Screenshot Mode:
//   --url        : The URL of the page to capture.
//   --fileName   : The name of the file to save the screenshot as (e.g., "page.png").
//   [Optional] --stepsToReproduce : JSON array of steps to reproduce on the page before taking a screenshot.
//                                  Example: '[{"action": "click", "selector": "button"}, {"action": "fillField", "selector": "#input", "value": "text"}, {"action": "wait", "value": "1000"}]'

/* ----------------------------- */
/*       Optional Parameters     */
/* ----------------------------- */
// Save Directory:
//   --savePath   : Custom directory to save screenshots (e.g., "./screenshots"). Defaults to current directory if not provided.

/* ----------------------------- */
/*       Login Parameters        */
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
const fs = require("fs");

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
var screenshotWidth = args.screenshotWidth || defaultScreenshotWidth;
var screenshotHeight = args.screenshotHeight || defaultScreenshotHeight;
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

    screenshotWidth = parseInt(screenshotWidth);
    screenshotHeight = parseInt(screenshotHeight);

    if (isNaN(screenshotWidth) || isNaN(screenshotHeight)) {
        console.error("Invalid screenshot dimensions.");
        process.exit(1);
    }

    if (
        // loginCredentials.url &&
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
        console.error("Error parsing JSON:", error.message || error);
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
        const [response] = await Promise.all([
            page.click(loginFormFieldsSelectors.submitButton),
            page.waitForNavigation({ waitUntil: "networkidle2", timeout: 5000 }).catch(() => null), // Catch if no navigation
        ]);

        // Check if navigation happened
        if (!response) {
            console.error("Login failed, no navigation occurred. Proceeding...");
        }
    } catch (error) {
        throw "Error logging in: " + error.message || error;
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
        return ((await page.$(loginFormFieldsSelectors.email)) !== null
            && (await page.$(loginFormFieldsSelectors.password)) !== null
            && (await page.$(loginFormFieldsSelectors.submitButton)) !== null);
    } catch (error) {
        throw "Error checking login page: " + error.message || error;
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
            switch (step.action) {
                case "click":
                    await page.click(step.selector);
                    break;
                case "fillField":
                    await page.type(step.selector, step.value);
                    break;
                case "wait":
                    await sleep(step.value);
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
 * The function `takeScreenshot` navigates to a specified URL, performs login if
 * required, reproduces specified steps, generates a unique file name, and captures
 * a full-page screenshot.
 * @param page - The `page` parameter in the `takeScreenshot` function is typically
 * an instance of a Puppeteer `Page` object. This object represents a single tab or
 * window in the browser and provides methods to interact with the page, navigate,
 * and capture screenshots.
 * @param url - The `url` parameter in the `takeScreenshot` function is the URL of
 * the webpage from which you want to capture a screenshot.
 * @param stepsToReproduce - The `stepsToReproduce` parameter in the
 * `takeScreenshot` function is used to provide a set of steps that can be
 * reproduced on the webpage before taking the screenshot. These steps typically
 * include interactions or actions that need to be performed on the page to reach a
 * specific state or view that needs to
 * @param fileName - The `fileName` parameter in the `takeScreenshot` function is
 * the name you want to give to the screenshot file that will be saved. It is the
 * name under which the screenshot will be stored in the specified `savePath`.
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

        if (!fileName) {
            fileName = getDefaultFileName();
        }

        // Capture screenshot
        await page.screenshot({
            path: path.join(savePath, fileName),
            fullPage: true,
        });
    } catch (error) {
        throw "Error taking screenshot '" + fileName + "': " + error.message || error;
    }
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
                await takeScreenshot(
                    page,
                    item.url,
                    item.stepsToReproduce,
                    item.fileName
                );
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
        console.log("Batch process failed:", error.message || error);
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
/*      Aux Functions       */
/* ------------------------ */

/**
 * The function getDefaultFileName() returns a default file name for a screenshot
 * in the format "screenshot_[current date and time].png".
 * @returns The function `getDefaultFileName()` returns a string that consists of
 * "screenshot_" followed by the formatted date and time obtained from the function
 * `getFormatedDateTimeForDefaultFileName()`, and ending with the file extension
 * ".png".
 */
function getDefaultFileName() {
    return "screenshot_" + getFormatedDateTimeForDefaultFileName() + ".png";
}

/**
 * The function `getFormatedDateTimeForDefaultFileName` returns the current date
 * and time in a specific format suitable for a default file name.
 * @returns The function `getFormatedDateTimeForDefaultFileName` returns a string
 * in the format "YYYY-MM-DD_HH-MM-SS", representing the current date and time.
 */
function getFormatedDateTimeForDefaultFileName() {
    var date = new Date();
    return (
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getDate() +
        "_" +
        date.getHours() +
        "-" +
        date.getMinutes() +
        "-" +
        date.getSeconds()
    );
}

/**
 * The function `sleep` returns a promise that resolves after a specified number of
 * milliseconds.
 * @param ms - The `ms` parameter in the `sleep` function represents the number of
 * milliseconds for which the function will pause execution before resolving the
 * promise.
 * @returns The function `sleep` is being returned. It is a function that takes a
 * parameter `ms` (representing milliseconds) and returns a Promise that resolves
 * after the specified number of milliseconds using `setTimeout`.
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
