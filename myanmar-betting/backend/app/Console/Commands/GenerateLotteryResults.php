<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\LotteryService;
use Carbon\Carbon;
use Illuminate\Console\Command;

class GenerateLotteryResults extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'lottery:generate {type : The type of lottery (2d/3d/thai)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate lottery results and process bets';

    /**
     * The lottery service instance.
     *
     * @var \App\Services\LotteryService
     */
    protected $lotteryService;

    /**
     * Create a new command instance.
     */
    public function __construct(LotteryService $lotteryService)
    {
        parent::__construct();
        $this->lotteryService = $lotteryService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $type = $this->argument('type');
        $admin = User::where('is_admin', true)->first();

        if (!$admin) {
            $this->error('No admin user found!');
            return 1;
        }

        // Generate number based on lottery type
        $number = match ($type) {
            '2d' => $this->lotteryService->generateTwoDNumber(),
            '3d' => $this->lotteryService->generateThreeDNumber(),
            'thai' => $this->lotteryService->generateThaiNumber(),
            default => throw new \InvalidArgumentException('Invalid lottery type'),
        };

        // Create result and process bets
        $this->lotteryService->createResult($type, $number, now(), $admin);

        $this->info("Generated {$type} lottery result: {$number}");
        return 0;
    }
}
