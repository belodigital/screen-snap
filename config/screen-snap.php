<?php

declare(strict_types=1);

return [

   /*
   |--------------------------------------------------------------------------
   | ScreenSnap Configuration
   |--------------------------------------------------------------------------
   |
   | These values are used for configuring the behavior of screenshots
   | taken by ScreenSnap. The save path, login URL, credentials,
   | and form selectors are configurable here.
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
