<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Bet;
use App\Models\Transaction;
use App\Models\FootballMatch;
use App\Services\LotteryService;
use App\Events\MatchFinished;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    protected $lotteryService;

    public function __construct(LotteryService $lotteryService)
    {
        $this->lotteryService = $lotteryService;
    }

    /**
     * Get betting statistics
     */
    public function getStats()
    {
        // Daily stats
        $today = Carbon::today();
        $dailyStats = [
            'daily_users' => User::whereDate('created_at', $today)->count(),
            'daily_bets' => Bet::whereDate('created_at', $today)->count(),
            'daily_bet_amount' => Bet::whereDate('created_at', $today)->sum('amount'),
            'daily_winnings' => Bet::whereDate('created_at', $today)
                ->where('status', 'won')
                ->sum('payout'),
            'daily_deposits' => Transaction::whereDate('created_at', $today)
                ->where('type', 'deposit')
                ->where('status', 'completed')
                ->sum('amount'),
            'daily_withdrawals' => Transaction::whereDate('created_at', $today)
                ->where('type', 'withdrawal')
                ->where('status', 'completed')
                ->sum('amount'),
        ];

        // Total stats
        $totalStats = [
            'total_users' => User::count(),
            'total_bets' => Bet::count(),
            'total_bet_amount' => Bet::sum('amount'),
            'total_winnings' => Bet::where('status', 'won')->sum('payout'),
            'total_deposits' => Transaction::where('type', 'deposit')
                ->where('status', 'completed')
                ->sum('amount'),
            'total_withdrawals' => Transaction::where('type', 'withdrawal')
                ->where('status', 'completed')
                ->sum('amount'),
            'active_matches' => FootballMatch::where('status', 'live')->count(),
        ];

        // Betting type distribution
        $betDistribution = Bet::select('type', DB::raw('count(*) as count'))
            ->groupBy('type')
            ->get()
            ->pluck('count', 'type');

        // Recent winners
        $recentWinners = Bet::with('user')
            ->where('status', 'won')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($bet) {
                return [
                    'user' => $bet->user->name,
                    'type' => $bet->type,
                    'amount' => $bet->amount,
                    'payout' => $bet->payout,
                    'date' => $bet->created_at,
                ];
            });

        return response()->json([
            'daily' => $dailyStats,
            'total' => $totalStats,
            'bet_distribution' => $betDistribution,
            'recent_winners' => $recentWinners,
        ]);
    }

    /**
     * Get revenue chart data
     */
    public function getRevenueData(Request $request)
    {
        $days = $request->get('days', 7);
        $startDate = Carbon::now()->subDays($days - 1)->startOfDay();

        $revenues = Transaction::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('SUM(CASE WHEN type = "deposit" AND status = "completed" THEN amount ELSE 0 END) as deposits'),
            DB::raw('SUM(CASE WHEN type = "withdrawal" AND status = "completed" THEN amount ELSE 0 END) as withdrawals'),
            DB::raw('SUM(CASE WHEN type = "bet" THEN amount ELSE 0 END) as bets'),
            DB::raw('SUM(CASE WHEN type = "winning" THEN amount ELSE 0 END) as winnings')
        )
            ->where('created_at', '>=', $startDate)
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json($revenues);
    }

    /**
     * Get user activity data
     */
    public function getUserActivity(Request $request)
    {
        $days = $request->get('days', 7);
        $startDate = Carbon::now()->subDays($days - 1)->startOfDay();

        $activities = DB::table('users')
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as new_users')
            )
            ->where('created_at', '>=', $startDate)
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $logins = DB::table('personal_access_tokens')
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(DISTINCT tokenable_id) as active_users')
            )
            ->where('created_at', '>=', $startDate)
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json([
            'new_users' => $activities,
            'active_users' => $logins,
        ]);
    }

    /**
     * Get top users
     */
    public function getTopUsers(Request $request)
    {
        $type = $request->get('type', 'bets'); // bets, winnings, deposits
        $limit = $request->get('limit', 10);

        switch ($type) {
            case 'bets':
                $users = User::select('users.*')
                    ->addSelect(DB::raw('COUNT(bets.id) as total_bets'))
                    ->addSelect(DB::raw('SUM(bets.amount) as total_amount'))
                    ->leftJoin('bets', 'users.id', '=', 'bets.user_id')
                    ->groupBy('users.id')
                    ->orderBy('total_bets', 'desc')
                    ->limit($limit)
                    ->get();
                break;

            case 'winnings':
                $users = User::select('users.*')
                    ->addSelect(DB::raw('SUM(bets.payout) as total_winnings'))
                    ->leftJoin('bets', function ($join) {
                        $join->on('users.id', '=', 'bets.user_id')
                            ->where('bets.status', '=', 'won');
                    })
                    ->groupBy('users.id')
                    ->orderBy('total_winnings', 'desc')
                    ->limit($limit)
                    ->get();
                break;

            case 'deposits':
                $users = User::select('users.*')
                    ->addSelect(DB::raw('SUM(transactions.amount) as total_deposits'))
                    ->leftJoin('transactions', function ($join) {
                        $join->on('users.id', '=', 'transactions.user_id')
                            ->where('transactions.type', '=', 'deposit')
                            ->where('transactions.status', '=', 'completed');
                    })
                    ->groupBy('users.id')
                    ->orderBy('total_deposits', 'desc')
                    ->limit($limit)
                    ->get();
                break;

            default:
                return response()->json(['message' => 'Invalid type'], 400);
        }

        return response()->json($users);
    }

    /**
     * Generate lottery result
     */
    public function generateLotteryResult(Request $request)
    {
        $request->validate([
            'type' => 'required|string|in:2d,3d,thai',
            'numbers' => 'required|array',
            'numbers.*' => 'required|string',
        ]);

        $result = $this->lotteryService->generateResult(
            $request->type,
            $request->numbers
        );

        return response()->json($result);
    }

    /**
     * Update football match score
     */
    public function updateMatchScore(Request $request, FootballMatch $match)
    {
        $request->validate([
            'home_score' => 'required|integer|min:0',
            'away_score' => 'required|integer|min:0',
            'status' => 'required|string|in:live,finished',
        ]);

        $match->update([
            'home_score' => $request->home_score,
            'away_score' => $request->away_score,
            'status' => $request->status,
        ]);

        if ($request->status === 'finished') {
            // Process all bets related to this match
            event(new MatchFinished($match));
        }

        return response()->json($match);
    }

    /**
     * Get all users
     */
    public function getUsers(Request $request)
    {
        $users = User::query()
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->when($request->sort_by, function ($query, $sortBy) {
                $query->orderBy($sortBy, $request->sort_direction ?? 'asc');
            })
            ->paginate($request->per_page ?? 15);

        return response()->json($users);
    }

    /**
     * Get user transactions
     */
    public function getUserTransactions(Request $request, User $user)
    {
        $transactions = $user->transactions()
            ->when($request->type, function ($query, $type) {
                $query->where('type', $type);
            })
            ->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 15);

        return response()->json($transactions);
    }

    /**
     * Get user bets
     */
    public function getUserBets(Request $request, User $user)
    {
        $bets = $user->bets()
            ->when($request->type, function ($query, $type) {
                $query->where('type', $type);
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 15);

        return response()->json($bets);
    }

    /**
     * Get pending transactions
     */
    public function getPendingTransactions(Request $request)
    {
        $transactions = Transaction::with('user')
            ->where('status', 'pending')
            ->when($request->type, function ($query, $type) {
                $query->where('type', $type);
            })
            ->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 15);

        return response()->json($transactions);
    }

    /**
     * Approve a transaction
     */
    public function approveTransaction(Request $request, Transaction $transaction)
    {
        if ($transaction->status !== 'pending') {
            return response()->json([
                'message' => 'Transaction is not pending',
            ], 400);
        }

        DB::transaction(function () use ($transaction) {
            // Update transaction status
            $transaction->update([
                'status' => 'completed',
            ]);

            // Update user balance for deposits
            if ($transaction->type === 'deposit') {
                $transaction->user->update([
                    'balance' => $transaction->user->balance + $transaction->amount,
                ]);
            }
        });

        return response()->json([
            'message' => 'Transaction approved successfully',
        ]);
    }

    /**
     * Reject a transaction
     */
    public function rejectTransaction(Request $request, Transaction $transaction)
    {
        if ($transaction->status !== 'pending') {
            return response()->json([
                'message' => 'Transaction is not pending',
            ], 400);
        }

        DB::transaction(function () use ($transaction) {
            // Update transaction status
            $transaction->update([
                'status' => 'failed',
            ]);

            // Refund user balance for withdrawals
            if ($transaction->type === 'withdrawal') {
                $transaction->user->update([
                    'balance' => $transaction->user->balance + $transaction->amount,
                ]);
            }
        });

        return response()->json([
            'message' => 'Transaction rejected successfully',
        ]);
    }

    /**
     * Create a new agent account
     */
    public function createAgent(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|unique:users,phone',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $request->name,
            'phone' => $request->phone,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'agent',
            'balance' => 0,
        ]);

        return response()->json([
            'message' => 'Agent account created successfully',
            'user' => $user
        ], 201);
    }

    /**
     * Add points to agent account
     */
    public function addAgentPoints(Request $request, User $user)
    {
        // Validate request
        $request->validate([
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string|max:255'
        ]);

        // Check if user is an agent
        if (!$user->isAgent()) {
            return response()->json([
                'message' => 'This user is not an agent'
            ], 400);
        }

        DB::beginTransaction();
        try {
            // Create transaction record
            $transaction = Transaction::create([
                'user_id' => $user->id,
                'type' => 'admin_deposit',
                'amount' => $request->amount,
                'status' => 'completed',
                'description' => $request->description ?? 'Points added by admin',
                'reference' => 'ADMIN-' . time(), // Adding unique reference
            ]);

            // Update user balance
            $user->balance += $request->amount;
            $user->save();

            DB::commit();

            return response()->json([
                'message' => 'Points added successfully',
                'transaction' => $transaction,
                'user' => $user
            ]);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Failed to add points',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
