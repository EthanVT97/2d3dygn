<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        Commands\GenerateLotteryResults::class,
        Commands\UpdateFootballMatch::class,
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        // Generate 2D lottery results at 12:00 PM and 4:30 PM every day
        $schedule->command('lottery:generate 2d')
                ->twiceDaily(12, 16, 30)
                ->timezone('Asia/Yangon');

        // Generate 3D lottery results at 2:00 PM on Wednesdays and Sundays
        $schedule->command('lottery:generate 3d')
                ->weeklyOn(0, '14:00') // Sunday
                ->weeklyOn(3, '14:00') // Wednesday
                ->timezone('Asia/Yangon');

        // Generate Thai lottery results on the 1st and 16th of every month at 3:00 PM
        $schedule->command('lottery:generate thai')
                ->monthlyOn(1, '15:00')
                ->monthlyOn(16, '15:00')
                ->timezone('Asia/Yangon');
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
