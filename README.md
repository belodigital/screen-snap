# Screen Snap

[![Latest Version on Packagist](https://img.shields.io/packagist/v/belodigital/screen-snap.svg?style=flat-square)](https://packagist.org/packages/belodigital/screen-snap)
[![GitHub Tests Action Status](https://img.shields.io/github/actions/workflow/status/belodigital/screen-snap/run-tests.yml?branch=main&label=tests&style=flat-square)](https://github.com/belodigital/screen-snap/actions?query=workflow%3Arun-tests+branch%3Amain)
[![GitHub Code Style Action Status](https://img.shields.io/github/actions/workflow/status/belodigital/screen-snap/fix-php-code-style-issues.yml?branch=main&label=code%20style&style=flat-square)](https://github.com/belodigital/screen-snap/actions?query=workflow%3A"Fix+PHP+code+style+issues"+branch%3Amain)
[![Total Downloads](https://img.shields.io/packagist/dt/belodigital/screen-snap.svg?style=flat-square)](https://packagist.org/packages/belodigital/screen-snap)

This package provides a laravel command to take screenshots of webpages automatically.

## Installation

Install ScreenSnap package by running the following commands in your Laravel project directory:

```bash
composer require belodigital/screen-snap
```

You can publish the package configuration file with:

```bash
php artisan vendor:publish --tag="screen-snap-config"
```

This is the contents of the published configuration file:

```php
return [

   /*
   |--------------------------------------------------------------------------
   | ScreenSnap Configuration
   |--------------------------------------------------------------------------
   |
   | These values are used for configuring the behavior of screenshots
   | taken by ScreenSnap. The save path, credentials, and form selectors
   | are configurable here.
   |
   */

    /*
    |--------------------------------------------------------------------------
    | ScreenSnap Save Path
    |--------------------------------------------------------------------------
    |
    | This value defines the path where the screenshots will be saved. You can
    | specify an absolute path or a relative one using Laravel's helper functions.
    | Example: '/path/to/save' or public_path() . '/screenshots'
    |
    */
    'screensnap_save_path' => env('SCREENSNAP_SAVE_PATH', public_path() . '/images/screensnap'),

    /*
    |--------------------------------------------------------------------------
    | ScreenSnap Data File
    |--------------------------------------------------------------------------
    |
    | The path to the JSON file containing the data to be used for capturing
    | screenshots. This file should contain an array of URLs to capture with
    | the proper structure (read the documentation).
    | Example: '/path/to/data.json'
    |
    */
    'screensnap_data_file' => env('SCREENSNAP_DATA_FILE', null),

    /*
    |--------------------------------------------------------------------------
    | Login Username
    |--------------------------------------------------------------------------
    |
    | The username or email that will be used for the login process. Provide
    | a valid username that has access to the system you want to capture.
    | Example: 'admin@example.com'
    |
    */
    'screensnap_login_username' => env('SCREENSNAP_LOGIN_USERNAME', null),

    /*
    |--------------------------------------------------------------------------
    | Login Password
    |--------------------------------------------------------------------------
    |
    | The password associated with the login username. Ensure that the password
    | is correct and corresponds to the username provided above.
    | Example: 'secure_password'
    |
    */
    'screensnap_login_password' => env('SCREENSNAP_LOGIN_PASSWORD', null),

    /*
    |--------------------------------------------------------------------------
    | Username Field Selector
    |--------------------------------------------------------------------------
    |
    | The CSS selector for the username input field on the login form. This is
    | used to identify where to input the username during the login process.
    | Example: '#username', '[name="email"]'
    |
    */
    'screensnap_login_username_field_selector' => env('SCREENSNAP_LOGIN_USERNAME_FIELD_SELECTOR', null),

    /*
    |--------------------------------------------------------------------------
    | Password Field Selector
    |--------------------------------------------------------------------------
    |
    | The CSS selector for the password input field on the login form. This is
    | used to identify where to input the password during the login process.
    | Example: '#password', '[name="password"]'
    |
    */
    'screensnap_login_password_field_selector' => env('SCREENSNAP_LOGIN_PASSWORD_FIELD_SELECTOR', null),

    /*
    |--------------------------------------------------------------------------
    | Submit Button Selector
    |--------------------------------------------------------------------------
    |
    | The CSS selector for the login form submit button. This selector is used
    | to identify which button to click in order to submit the login form.
    | Example: '#login-submit', '[type="submit"]'
    |
    */
    'screensnap_login_submit_button_selector' => env('SCREENSNAP_LOGIN_SUBMIT_BUTTON_SELECTOR', null),
];
```

## Usage

The **Screen Snap** package provides a command to automate the process of capturing screenshots in your Laravel application. The command can be used to take a single screenshot or multiple screenshots in batch mode. Below are the available arguments and options for the `screen-snap:take` command.

### Command Syntax

```bash
php artisan screen-snap:take
    --savePath= : Optional path to save the screenshots. If not provided, the configuration default path will be used
    --url= : URL to capture the screenshot, when capturing a single one
    --fileName= : Name of the file where the screenshot will be saved, when capturing a single one. If a file with the same name already exists, it will be replaced
    --stepsToReproduce= : JSON formatted string of steps to reproduce before taking the screenshot, when capturing a single one
    --data= : JSON data or file path for batch screenshot capture
    --loginUsername= : Username for login
    --loginPassword= : Password for login
    --loginUsernameFieldSelector= : CSS selector for the username field
    --loginPasswordFieldSelector= : CSS selector for the password field
    --loginSubmitButtonSelector= : CSS selector for the login submit button
    --pageNavigationTimeout= : Optional timeout for page navigation
    --screenshotWidth= : Width of the screenshot
    --screenshotHeight= : Height of the screenshot
```

### Command Options

- `--savePath=`: Optional path where the screenshots will be saved. If not provided, the default path in the configuration file will be used.

- `--url=`: (Single mode) The URL of the page to capture a screenshot from. This option enables single screenshot mode.

- `--fileName=`: (Single mode) The name of the file to save the screenshot. Must be used with `--url`. If a file with the same name already exists, it will be replaced.

- `--stepsToReproduce=`: (Single mode) A JSON string that describes steps to perform on the page before capturing the screenshot (e.g., clicks, filling forms). The available actions are:

  - **click**: This action is used to simulate clicking on a button, link, or any other clickable element. It requires only a `selector`.
  - **fillField**: This action is used to fill an input field with a specific value, such as a text field or email input. It requires both a `selector` and a `value`.

  #### Example for click:

  ```json
    [{"selector": "#login-button", "action": "click"}]
  ```

  This example performs a click action on the element with the CSS selector #login-button.

  #### Example for fillField:

  ```json
    [{"selector": "#email", "action": "fillField", "value": "user@example.com"}]
  ```

  This example fills the input field with the CSS selector #email with the value "user@example.com".

  #### Example for wait:

  ```json
    [{"action": "wait", "value": "1000"}]
  ```

  This example instructs the script to pause its execution for a specified amount of time in milliseconds.

  #### Example with multiple actions:

  You can chain multiple actions together. For example, clicking a button and then filling a field:

  ```json
    [{"selector": "#login-button", "action": "click"}, {"selector": "#email", "action": "fillField", "value": "user@example.com"}, {"action": "wait", "value": "1000"}]
  ```

  In this example, it first clicks the #login-button and then fills the #email input field with the value "user@example.com".

- `--data=`: (Batch mode) The path to a JSON file or a raw JSON string that contains multiple URLs to capture screenshots from.

- `--loginUsername=`: The username to use for logging in to the application.

- `--loginPassword=`: The password for the username provided.

- `--loginUsernameFieldSelector=`: The CSS selector for the username input field on the login form.

- `--loginPasswordFieldSelector=`: The CSS selector for the password input field on the login form.

- `--loginSubmitButtonSelector=`: The CSS selector for the login form's submit button.

- `--pageNavigationTimeout=`: Optional timeout for navigating between pages. Useful if a page takes time to load.

- `--screenshotWidth=`: The width of the screenshot to be captured. Default is the browser's viewport width.

- `--screenshotHeight=`: The height of the screenshot to be captured. Default is the browser's viewport height.

### Examples

#### 1. Capturing a Single Screenshot
To capture a single screenshot of a specific URL and save it to a file:

```bash
php artisan screen-snap:take --url=https://example.com --fileName=homepage.png
```

The page at `https://example.com` is captured and saved as `homepage.png` in the default save path.

#### 2. Capturing a Screenshot with Steps

If you need to perform actions on the page (e.g., click a button) before capturing the screenshot, you can specify the steps using the `--stepsToReproduce` option:

```bash
php artisan screen-snap:take --url=https://example.com/login --fileName=login-page.png --stepsToReproduce='[{"selector":"#login-button", "action":"click"}]'
```

The page at `https://example.com/login` is loaded.  
A click action is performed on the element with the CSS selector `#login-button` before capturing the screenshot and saving it as `login-page.png`.

#### 3. Batch Screenshot Mode

To capture multiple screenshots in batch mode using a JSON file or JSON data:

```bash
php artisan screen-snap:take --data=/path/to/urls.json
```

The `urls.json` file should be structured as follows:

```json
[
  {
    "url": "https://example.com/page1",
    "fileName": "page1.png",
    "stepsToReproduce": [{"selector":"#button1", "action":"click"}]
  },
  {
    "url": "https://example.com/page2",
    "fileName": "page2.png"
  }
]
```

When passing JSON data directly, it should be provided as a string.

```bash
php artisan screen-snap:take --data='[
    {
      "url": "https://orion.managewp.com/",
      "fileName": "page1.png"
    },
    {
      "url": "https://example.com/page2"
    }
  ]'
```

The command captures screenshots of multiple URLs provided in the JSON file. Each page can include optional steps to reproduce before capturing the screenshot.

#### 4. Capturing Screenshots with Custom Login Credentials

If the page requires authentication, you can specify login credentials and form field selectors:

```bash
php artisan screen-snap:take --url=https://example.com/dashboard --fileName=dashboard.png --loginUsername=admin --loginPassword=admin123 --loginUsernameFieldSelector="#email" --loginPasswordFieldSelector="#password" --loginSubmitButtonSelector="#submit"
```

The page at https://example.com/login is loaded.
The username and password are entered in the respective fields (#email and #password), and the login form is submitted using the button with the selector #submit.
After login, a screenshot of https://example.com/dashboard is captured and saved as dashboard.png.

#### 5. Capturing Screenshots with Custom Dimensions

To set custom dimensions for the screenshot, use the --screenshotWidth and --screenshotHeight options:

```bash
php artisan screen-snap:take --url=https://example.com --fileName=custom-size.png --screenshotWidth=1280 --screenshotHeight=720
```

The screenshot of https://example.com is captured with a width of 1280px and a height of 720px.

By using the various options provided, you can easily capture both single and batch screenshots, with or without login, and customize the screenshot dimensions to fit your needs.

## Testing

```bash
composer test
```

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information on what has changed recently.

## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

## Security Vulnerabilities

Please review [our security policy](../../security/policy) on how to report security vulnerabilities.

## Credits

- [dcruz-belodigital](https://github.com/dcruz-belodigital)
- [All Contributors](../../contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
