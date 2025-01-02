<?php

namespace App\Services;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class TransactionService
{
    /**
     * Create a deposit transaction
     */
    public function deposit(User $user, float $amount, string $description = null): Transaction
    {
        return DB::transaction(function () use ($user, $amount, $description) {
            // Update user balance
            $user->update([
                'balance' => $user->balance + $amount,
            ]);

            // Create transaction record
            return Transaction::create([
                'user_id' => $user->id,
                'type' => 'deposit',
                'amount' => $amount,
                'status' => 'completed',
                'description' => $description ?? 'Deposit to account',
            ]);
        });
    }

    /**
     * Create a withdrawal transaction
     */
    public function withdraw(User $user, float $amount, string $description = null): Transaction
    {
        if ($user->balance < $amount) {
            throw new \Exception('Insufficient balance');
        }

        return DB::transaction(function () use ($user, $amount, $description) {
            // Update user balance
            $user->update([
                'balance' => $user->balance - $amount,
            ]);

            // Create transaction record
            return Transaction::create([
                'user_id' => $user->id,
                'type' => 'withdrawal',
                'amount' => $amount,
                'status' => 'completed',
                'description' => $description ?? 'Withdrawal from account',
            ]);
        });
    }

    /**
     * Create a bet transaction
     */
    public function bet(User $user, float $amount, $bet, string $description = null): Transaction
    {
        if ($user->balance < $amount) {
            throw new \Exception('Insufficient balance');
        }

        return DB::transaction(function () use ($user, $amount, $bet, $description) {
            // Update user balance
            $user->update([
                'balance' => $user->balance - $amount,
            ]);

            // Create transaction record
            return Transaction::create([
                'user_id' => $user->id,
                'type' => 'bet',
                'amount' => $amount,
                'reference_type' => get_class($bet),
                'reference_id' => $bet->id,
                'status' => 'completed',
                'description' => $description ?? 'Bet placement',
            ]);
        });
    }

    /**
     * Create a refund transaction
     */
    public function refund(User $user, float $amount, $bet, string $description = null): Transaction
    {
        return DB::transaction(function () use ($user, $amount, $bet, $description) {
            // Update user balance
            $user->update([
                'balance' => $user->balance + $amount,
            ]);

            // Create transaction record
            return Transaction::create([
                'user_id' => $user->id,
                'type' => 'refund',
                'amount' => $amount,
                'reference_type' => get_class($bet),
                'reference_id' => $bet->id,
                'status' => 'completed',
                'description' => $description ?? 'Bet refund',
            ]);
        });
    }
}
