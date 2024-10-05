# Screen Snap

[![Latest Version on Packagist](https://img.shields.io/packagist/v/belodigital/screen-snap.svg?style=flat-square)](https://packagist.org/packages/belodigital/screen-snap)
[![GitHub Tests Action Status](https://img.shields.io/github/actions/workflow/status/belodigital/screen-snap/run-tests.yml?branch=main&label=tests&style=flat-square)](https://github.com/belodigital/screen-snap/actions?query=workflow%3Arun-tests+branch%3Amain)
[![GitHub Code Style Action Status](https://img.shields.io/github/actions/workflow/status/belodigital/screen-snap/fix-php-code-style-issues.yml?branch=main&label=code%20style&style=flat-square)](https://github.com/belodigital/screen-snap/actions?query=workflow%3A"Fix+PHP+code+style+issues"+branch%3Amain)
[![Total Downloads](https://img.shields.io/packagist/dt/belodigital/screen-snap.svg?style=flat-square)](https://packagist.org/packages/belodigital/screen-snap)

This is where your description should go. Limit it to a paragraph or two. Consider adding a small example.

## Installation

Install ScreenSnap package by running the following commands in your Laravel project directory:

```bash
composer require belodigital/screen-snap
php artisan vendor:publish --tag="screen-snap-assets"
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
    | Login URL
    |--------------------------------------------------------------------------
    |
    | This is the URL where the login process starts. It should point to the
    | login page of the application being tested or captured. Make sure this
    | URL is correct for your staging or production environment.
    | Example: 'https://example.com/login'
    |
    */
    'screensnap_login_url' => env('SCREENSNAP_LOGIN_URL', url('/login')),

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

```php
$screenSnap = new ScreenSnap();
echo $screenSnap->echoPhrase('Hello, ScreenSnap!');
```

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

- [dcruz-belodigital](https://github.com/dcruz)
- [All Contributors](../../contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
