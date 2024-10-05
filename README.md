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
```
```bash
php artisan vendor:publish --tag="screen-snap-scripts"
```

You can publish the package configuration file with:

```bash
php artisan vendor:publish --tag="screen-snap-config"
```

This is the contents of the published configuration file:

```php
return [
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
