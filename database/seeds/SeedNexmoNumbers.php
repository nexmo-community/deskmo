<?php

namespace App;

use Illuminate\Database\Seeder;

class SeedNexmoNumbers extends Seeder
{
    /**
     * An array containing [ country => number ] combinations to be seeded
     */
    const NUMBERS_TO_SEED = [
        ['country' => 'US', 'number' => 'sample-us-number'],
        ['country' => 'GB', 'number' => 'sample-gb-number']
    ];

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        foreach (static::NUMBERS_TO_SEED as $number)
            \App\NexmoNumber::create(['country' => $number['country'], 'number' => $number['number']]);
    }
}
