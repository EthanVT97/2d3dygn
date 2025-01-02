<?php

namespace App\Services;

use App\Models\Bet;
use App\Models\LotteryResult;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class LotteryService
{
    /**
     * Generate a random 2D number
     */
    public function generateTwoDNumber(): string
    {
        return str_pad(rand(0, 99), 2, '0', STR_PAD_LEFT);
    }

    /**
     * Generate a random 3D number
     */
    public function generateThreeDNumber(): string
    {
        return str_pad(rand(0, 999), 3, '0', STR_PAD_LEFT);
    }

    /**
     * Generate a random Thai lottery number
     */
    public function generateThaiNumber(): string
    {
        return str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
    }

    /**
     * Generate lottery result from provided numbers or random if not provided
     */
    public function generateResult(string $type, array $numbers = []): LotteryResult
    {
        $number = '';

        if (!empty($numbers)) {
            $number = implode('', $numbers);
        } else {
            switch ($type) {
                case '2d':
                    $number = $this->generateTwoDNumber();
                    break;
                case '3d':
                    $number = $this->generateThreeDNumber();
                    break;
                case 'thai':
                    $number = $this->generateThaiNumber();
                    break;
            }
        }

        return DB::transaction(function () use ($type, $number) {
            // Create result
            $result = LotteryResult::create([
                'type' => $type,
                'number' => $number,
                'draw_time' => now(),
                'created_by' => auth()->id(),
            ]);

            // Get all pending bets for this lottery type
            $bets = Bet::where('type', $type)
                ->where('status', 'pending')
                ->get();

            foreach ($bets as $bet) {
                $this->processBet($bet, $result);
            }

            return $result;
        });
    }

    /**
     * Create a new lottery result and process bets
     */
    public function createResult(string $type, string $number, Carbon $drawTime, User $admin): void
    {
        DB::transaction(function () use ($type, $number, $drawTime, $admin) {
            // Create result
            $result = LotteryResult::create([
                'type' => $type,
                'number' => $number,
                'draw_time' => $drawTime,
                'created_by' => $admin->id,
            ]);

            // Get all pending bets for this lottery type
            $bets = Bet::where('type', $type)
                ->where('status', 'pending')
                ->get();

            foreach ($bets as $bet) {
                $this->processBet($bet, $result);
            }
        });
    }

    /**
     * Process a single bet against a result
     */
    private function processBet(Bet $bet, LotteryResult $result): void
    {
        // Check if bet number matches result
        $isWinner = $bet->number === $result->number;

        // Calculate winning amount based on lottery type
        $winningAmount = 0;
        if ($isWinner) {
            switch ($bet->type) {
                case '2d':
                    $winningAmount = $bet->amount * 85; // 85x payout for 2D
                    break;
                case '3d':
                    $winningAmount = $bet->amount * 500; // 500x payout for 3D
                    break;
                case 'thai':
                    $winningAmount = $bet->amount * 1000; // 1000x payout for Thai lottery
                    break;
            }
        }

        // Update bet status and winning amount
        $bet->update([
            'status' => $isWinner ? 'won' : 'lost',
            'result_id' => $result->id,
            'winning_amount' => $winningAmount,
        ]);

        // If bet won, create transaction and update user balance
        if ($isWinner) {
            $bet->user->update([
                'balance' => $bet->user->balance + $winningAmount,
            ]);

            Transaction::create([
                'user_id' => $bet->user_id,
                'type' => 'win',
                'amount' => $winningAmount,
                'reference_type' => Bet::class,
                'reference_id' => $bet->id,
                'status' => 'completed',
                'description' => "Won {$bet->type} lottery: {$bet->number}",
            ]);
        }
    }
}
