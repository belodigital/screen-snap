<?php

namespace ScreenSnap\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @see \ScreenSnap\ScreenSnap
 */
class ScreenSnap extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return \ScreenSnap\ScreenSnap::class;
    }
}
