<?php

namespace App\Listeners;

use App\Events\MatchFinished;
use App\Models\Bet;
use App\Models\Transaction;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\DB;

class ProcessMatchBets implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Handle the event.
     */
    public function handle(MatchFinished $event): void
    {
        $match = $event->match;
        
        // Get all pending bets for this match
        $bets = Bet::where('match_id', $match->id)
            ->where('status', 'pending')
            ->get();

        foreach ($bets as $bet) {
            DB::transaction(function () use ($bet, $match) {
                $isWinner = false;
                $winningAmount = 0;

                // Check if bet is a winner based on odds type
                switch ($bet->odds->type) {
                    case 'home_win':
                        $isWinner = $match->home_score > $match->away_score;
                        break;
                    case 'draw':
                        $isWinner = $match->home_score === $match->away_score;
                        break;
                    case 'away_win':
                        $isWinner = $match->home_score < $match->away_score;
                        break;
                    case 'over':
                        $isWinner = ($match->home_score + $match->away_score) > $bet->odds->value;
                        break;
                    case 'under':
                        $isWinner = ($match->home_score + $match->away_score) < $bet->odds->value;
                        break;
                    case 'handicap':
                        $adjustedHomeScore = $match->home_score + $bet->odds->value;
                        $isWinner = $adjustedHomeScore > $match->away_score;
                        break;
                }

                if ($isWinner) {
                    $winningAmount = $bet->amount * $bet->odds_value;
                }

                // Update bet status and winning amount
                $bet->update([
                    'status' => $isWinner ? 'won' : 'lost',
                    'winning_amount' => $winningAmount,
                ]);

                // If bet won, create transaction and update user balance
                if ($isWinner) {
                    $bet->user->update([
                        'balance' => $bet->user->balance + $winningAmount,
                    ]);

                    Transaction::create([
                        'user_id' => $bet->user_id,
                        'type' => 'winning',
                        'amount' => $winningAmount,
                        'reference' => 'WIN' . $match->id . $bet->id,
                        'status' => 'completed',
                        'description' => 'Won football bet on ' . $match->homeTeam->name . ' vs ' . $match->awayTeam->name,
                    ]);
                }
            });
        }
    }
}
