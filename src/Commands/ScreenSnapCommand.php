<?php

namespace ScreenSnap\ScreenSnap\Commands;

use Illuminate\Console\Command;

class ScreenSnapCommand extends Command
{
    public $signature = 'screen-snap:take';

    public $description = 'Run script to take screenshots of the app and save them.';

    public function handle(): int
    {
        $this->comment('All done');

        return self::SUCCESS;
    }
}
