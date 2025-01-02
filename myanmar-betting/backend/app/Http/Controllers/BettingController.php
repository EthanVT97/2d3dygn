<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BettingController extends Controller
{
    /**
     * Get user's current balance
     */
    public function getBalance(Request $request)
    {
        return response()->json([
            'balance' => $request->user()->balance,
        ]);
    }

    /**
     * Get user's transaction history
     */
    public function getTransactions(Request $request)
    {
        $transactions = Transaction::where('user_id', $request->user()->id)
            ->when($request->type, function ($query, $type) {
                $query->where('type', $type);
            })
            ->when($request->date_from, function ($query, $dateFrom) {
                $query->whereDate('created_at', '>=', $dateFrom);
            })
            ->when($request->date_to, function ($query, $dateTo) {
                $query->whereDate('created_at', '<=', $dateTo);
            })
            ->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 15);

        return response()->json($transactions);
    }

    /**
     * Process a deposit request
     */
    public function deposit(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1000',
            'payment_method' => 'required|string|in:kpay,wave,cb,aya,kbz',
            'reference' => 'required|string|unique:transactions,reference',
        ]);

        DB::transaction(function () use ($request) {
            $user = $request->user();

            // Create transaction record
            Transaction::create([
                'user_id' => $user->id,
                'type' => 'deposit',
                'amount' => $request->amount,
                'payment_method' => $request->payment_method,
                'reference' => $request->reference,
                'status' => 'pending',
                'description' => 'Deposit via ' . $request->payment_method,
            ]);
        });

        return response()->json([
            'message' => 'Deposit request submitted successfully',
        ]);
    }

    /**
     * Process a withdrawal request
     */
    public function withdraw(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:5000',
            'payment_method' => 'required|string|in:kpay,wave,cb,aya,kbz',
            'account_name' => 'required|string',
            'account_number' => 'required|string',
        ]);

        $user = $request->user();

        if ($user->balance < $request->amount) {
            return response()->json([
                'message' => 'Insufficient balance',
            ], 400);
        }

        DB::transaction(function () use ($request, $user) {
            // Deduct balance immediately to prevent multiple withdrawals
            $user->balance -= $request->amount;
            $user->save();

            // Create transaction record
            Transaction::create([
                'user_id' => $user->id,
                'type' => 'withdrawal',
                'amount' => $request->amount,
                'payment_method' => $request->payment_method,
                'reference' => 'WD' . time() . rand(1000, 9999),
                'status' => 'pending',
                'description' => 'Withdrawal to ' . $request->payment_method . ' (' . $request->account_number . ')',
                'metadata' => [
                    'account_name' => $request->account_name,
                    'account_number' => $request->account_number,
                ],
            ]);
        });

        return response()->json([
            'message' => 'Withdrawal request submitted successfully',
            'balance' => $user->balance,
        ]);
    }
}
