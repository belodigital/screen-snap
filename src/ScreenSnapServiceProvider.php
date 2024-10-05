<?php

namespace ScreenSnap\ScreenSnap;

use Spatie\LaravelPackageTools\Package;
use Spatie\LaravelPackageTools\PackageServiceProvider;
use ScreenSnap\ScreenSnap\Commands\ScreenSnapCommand;

class ScreenSnapServiceProvider extends PackageServiceProvider
{
    public function boot()
    {
        $this->publishes([
            __DIR__.'/../assets/js/script-test.js' => public_path('js/script-test.js'),
        ], 'public');
    }

    public function configurePackage(Package $package): void
    {
        /*
         * This class is a Package Service Provider
         *
         * More info: https://github.com/spatie/laravel-package-tools
         */
        $package
            ->name('screen-snap')
            ->hasConfigFile()
            ->hasCommand(ScreenSnapCommand::class);
    }
}
