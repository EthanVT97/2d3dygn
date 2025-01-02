<?php

namespace App\Services;

use App\Models\FootballMatch;
use App\Models\FootballBet;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;

class FootballService
{
    /**
     * Update match score and process bets
     */
    public function updateMatchScore(FootballMatch $match, int $homeScore, int $awayScore): void
    {
        DB::transaction(function () use ($match, $homeScore, $awayScore) {
            // Update match score
            $match->update([
                'home_score' => $homeScore,
                'away_score' => $awayScore,
                'status' => 'finished',
            ]);

            // Process all pending bets for this match
            $bets = FootballBet::where('match_id', $match->id)
                ->where('status', 'pending')
                ->get();

            foreach ($bets as $bet) {
                $this->processBet($bet, $homeScore, $awayScore);
            }
        });
    }

    /**
     * Process a single football bet
     */
    private function processBet(FootballBet $bet, int $homeScore, int $awayScore): void
    {
        $isWinner = false;
        $winningAmount = 0;

        // Determine if bet is winning based on bet type
        switch ($bet->bet_type) {
            case 'win':
                if ($bet->selection === 'home' && $homeScore > $awayScore) {
                    $isWinner = true;
                } elseif ($bet->selection === 'away' && $awayScore > $homeScore) {
                    $isWinner = true;
                }
                break;

            case 'draw':
                if ($homeScore === $awayScore) {
                    $isWinner = true;
                }
                break;

            case 'over_under':
                $totalGoals = $homeScore + $awayScore;
                $line = (float) substr($bet->selection, 5); // e.g., "over_2.5" -> 2.5
                if (str_starts_with($bet->selection, 'over_') && $totalGoals > $line) {
                    $isWinner = true;
                } elseif (str_starts_with($bet->selection, 'under_') && $totalGoals < $line) {
                    $isWinner = true;
                }
                break;

            case 'handicap':
                // Format: "home_-1.5" or "away_+2"
                $parts = explode('_', $bet->selection);
                $team = $parts[0];
                $handicap = (float) $parts[1];
                
                if ($team === 'home') {
                    $adjustedScore = $homeScore + $handicap;
                    $isWinner = $adjustedScore > $awayScore;
                } else {
                    $adjustedScore = $awayScore + $handicap;
                    $isWinner = $adjustedScore > $homeScore;
                }
                break;
        }

        // Calculate winning amount if bet won
        if ($isWinner) {
            $winningAmount = $bet->amount * $bet->odds;
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
                'type' => 'win',
                'amount' => $winningAmount,
                'reference_type' => FootballBet::class,
                'reference_id' => $bet->id,
                'status' => 'completed',
                'description' => "Won football bet: {$bet->bet_type} - {$bet->selection}",
            ]);
        }
    }
}
