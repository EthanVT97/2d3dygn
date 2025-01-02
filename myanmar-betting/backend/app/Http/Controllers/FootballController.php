<?php

namespace App\Http\Controllers;

use App\Models\FootballMatch;
use App\Models\Bet;
use App\Models\MatchOdds;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FootballController extends Controller
{
    /**
     * Get list of upcoming matches
     */
    public function getMatches(Request $request)
    {
        $matches = FootballMatch::with(['homeTeam', 'awayTeam', 'league', 'odds'])
            ->when($request->league_id, function ($query, $leagueId) {
                $query->where('league_id', $leagueId);
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->date, function ($query, $date) {
                $query->whereDate('start_time', $date);
            })
            ->orderBy('start_time')
            ->paginate($request->per_page ?? 15);

        return response()->json($matches);
    }

    /**
     * Get match details
     */
    public function getMatch(FootballMatch $match)
    {
        $match->load(['homeTeam', 'awayTeam', 'league', 'odds', 'statistics']);
        return response()->json($match);
    }

    /**
     * Place a bet on a match
     */
    public function placeBet(Request $request)
    {
        $request->validate([
            'match_id' => 'required|exists:football_matches,id',
            'odds_id' => 'required|exists:match_odds,id',
            'amount' => 'required|numeric|min:100',
        ]);

        $match = FootballMatch::findOrFail($request->match_id);
        $odds = MatchOdds::findOrFail($request->odds_id);
        $user = $request->user();

        if ($match->status !== 'scheduled') {
            return response()->json([
                'message' => 'Match has already started or finished',
            ], 400);
        }

        if ($user->balance < $request->amount) {
            return response()->json([
                'message' => 'Insufficient balance',
            ], 400);
        }

        DB::transaction(function () use ($request, $user, $match, $odds) {
            // Deduct balance
            $user->balance -= $request->amount;
            $user->save();

            // Create bet
            Bet::create([
                'user_id' => $user->id,
                'type' => 'football',
                'match_id' => $match->id,
                'odds_id' => $odds->id,
                'odds_value' => $odds->odds,
                'amount' => $request->amount,
                'potential_win' => $request->amount * $odds->odds,
                'status' => 'pending',
            ]);
        });

        return response()->json([
            'message' => 'Bet placed successfully',
            'balance' => $user->balance,
        ]);
    }

    /**
     * Get user's betting history
     */
    public function getBets(Request $request)
    {
        $bets = Bet::where('user_id', $request->user()->id)
            ->where('type', 'football')
            ->with(['match.homeTeam', 'match.awayTeam', 'odds'])
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 15);

        return response()->json($bets);
    }
}
