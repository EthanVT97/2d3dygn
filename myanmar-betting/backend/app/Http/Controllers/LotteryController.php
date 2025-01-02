<?php

namespace App\Http\Controllers;

use App\Models\Bet;
use App\Models\LotteryResult;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LotteryController extends Controller
{
    /**
     * Get latest 2D lottery results
     */
    public function getTwoDResults()
    {
        $results = LotteryResult::where('type', '2d')
            ->orderBy('draw_time', 'desc')
            ->take(10)
            ->get();

        return response()->json($results);
    }

    /**
     * Place a 2D lottery bet
     */
    public function placeTwoDBet(Request $request)
    {
        $request->validate([
            'numbers' => 'required|array',
            'numbers.*' => 'required|string|size:2|regex:/^[0-9]+$/',
            'amounts' => 'required|array',
            'amounts.*' => 'required|numeric|min:100',
        ]);

        $user = $request->user();
        $totalAmount = array_sum($request->amounts);

        if ($user->balance < $totalAmount) {
            return response()->json([
                'message' => 'Insufficient balance',
            ], 400);
        }

        DB::transaction(function () use ($request, $user, $totalAmount) {
            // Deduct balance
            $user->balance -= $totalAmount;
            $user->save();

            // Create bets
            foreach ($request->numbers as $index => $number) {
                Bet::create([
                    'user_id' => $user->id,
                    'type' => '2d',
                    'number' => $number,
                    'amount' => $request->amounts[$index],
                    'status' => 'pending',
                ]);
            }
        });

        return response()->json([
            'message' => 'Bet placed successfully',
            'balance' => $user->balance,
        ]);
    }

    /**
     * Get user's 2D betting history
     */
    public function getTwoDHistory(Request $request)
    {
        $history = Bet::where('user_id', $request->user()->id)
            ->where('type', '2d')
            ->with('result')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($history);
    }

    /**
     * Get latest 3D lottery results
     */
    public function getThreeDResults()
    {
        $results = LotteryResult::where('type', '3d')
            ->orderBy('draw_time', 'desc')
            ->take(10)
            ->get();

        return response()->json($results);
    }

    /**
     * Place a 3D lottery bet
     */
    public function placeThreeDBet(Request $request)
    {
        $request->validate([
            'numbers' => 'required|array',
            'numbers.*' => 'required|string|size:3|regex:/^[0-9]+$/',
            'amounts' => 'required|array',
            'amounts.*' => 'required|numeric|min:100',
        ]);

        $user = $request->user();
        $totalAmount = array_sum($request->amounts);

        if ($user->balance < $totalAmount) {
            return response()->json([
                'message' => 'Insufficient balance',
            ], 400);
        }

        DB::transaction(function () use ($request, $user, $totalAmount) {
            // Deduct balance
            $user->balance -= $totalAmount;
            $user->save();

            // Create bets
            foreach ($request->numbers as $index => $number) {
                Bet::create([
                    'user_id' => $user->id,
                    'type' => '3d',
                    'number' => $number,
                    'amount' => $request->amounts[$index],
                    'status' => 'pending',
                ]);
            }
        });

        return response()->json([
            'message' => 'Bet placed successfully',
            'balance' => $user->balance,
        ]);
    }

    /**
     * Get user's 3D betting history
     */
    public function getThreeDHistory(Request $request)
    {
        $history = Bet::where('user_id', $request->user()->id)
            ->where('type', '3d')
            ->with('result')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($history);
    }

    /**
     * Get latest Thai lottery results
     */
    public function getThaiResults()
    {
        $results = LotteryResult::where('type', 'thai')
            ->orderBy('draw_time', 'desc')
            ->take(10)
            ->get();

        return response()->json($results);
    }

    /**
     * Place a Thai lottery bet
     */
    public function placeThaiLotteryBet(Request $request)
    {
        $request->validate([
            'numbers' => 'required|array',
            'numbers.*' => 'required|string|size:6|regex:/^[0-9]+$/',
            'amounts' => 'required|array',
            'amounts.*' => 'required|numeric|min:100',
        ]);

        $user = $request->user();
        $totalAmount = array_sum($request->amounts);

        if ($user->balance < $totalAmount) {
            return response()->json([
                'message' => 'Insufficient balance',
            ], 400);
        }

        DB::transaction(function () use ($request, $user, $totalAmount) {
            // Deduct balance
            $user->balance -= $totalAmount;
            $user->save();

            // Create bets
            foreach ($request->numbers as $index => $number) {
                Bet::create([
                    'user_id' => $user->id,
                    'type' => 'thai',
                    'number' => $number,
                    'amount' => $request->amounts[$index],
                    'status' => 'pending',
                ]);
            }
        });

        return response()->json([
            'message' => 'Bet placed successfully',
            'balance' => $user->balance,
        ]);
    }

    /**
     * Get user's Thai lottery betting history
     */
    public function getThaiHistory(Request $request)
    {
        $history = Bet::where('user_id', $request->user()->id)
            ->where('type', 'thai')
            ->with('result')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($history);
    }
}
