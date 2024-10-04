<?php

namespace ScreenSnap\ScreenSnap\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @see \ScreenSnap\ScreenSnap\ScreenSnap
 */
class ScreenSnap extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return \ScreenSnap\ScreenSnap\ScreenSnap::class;
    }
}
