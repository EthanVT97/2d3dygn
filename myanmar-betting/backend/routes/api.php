<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\BettingController;
use App\Http\Controllers\FootballController;
use App\Http\Controllers\LotteryController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Public routes
Route::get('/health-check', function() {
    try {
        // Check database connection
        DB::connection()->getPdo();
        
        return response()->json([
            'status' => 'healthy',
            'database' => 'connected',
            'timestamp' => now()->toIso8601String()
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'unhealthy',
            'database' => 'disconnected',
            'error' => $e->getMessage(),
            'timestamp' => now()->toIso8601String()
        ], 500);
    }
});

Route::get('/test-db', [App\Http\Controllers\TestController::class, 'testConnection']);

// Public game routes
Route::get('/lottery/results', [LotteryController::class, 'getTwoDResults']);
Route::get('/football/tables', [FootballController::class, 'getTables']);

// Auth routes
Route::group(['prefix' => 'auth'], function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // User routes
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('/balance', [BettingController::class, 'getBalance']);
    Route::get('/transactions', [BettingController::class, 'getTransactions']);

    // Profile routes
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/profile/password', [AuthController::class, 'updatePassword']);

    // Payment routes
    Route::post('/deposit', [BettingController::class, 'deposit']);
    Route::post('/withdraw', [BettingController::class, 'withdraw']);

    // Lottery routes
    Route::prefix('lottery')->group(function () {
        Route::post('/bet', [LotteryController::class, 'placeBet']);
        Route::get('/thai', [LotteryController::class, 'getThaiLotteryInfo']);
        Route::post('/thai/bet', [LotteryController::class, 'placeThaiLotteryBet']);
        Route::get('/laos', [LotteryController::class, 'getLaosLotteryInfo']);
        Route::post('/laos/bet', [LotteryController::class, 'placeLaosLotteryBet']);
    });

    // Football routes
    Route::prefix('matches')->group(function () {
        Route::get('/', [FootballController::class, 'getMatches']);
        Route::get('/{match}', [FootballController::class, 'getMatch']);
        Route::post('/bet', [FootballController::class, 'placeBet'])->middleware('auth:sanctum');
        Route::get('/bets/history', [FootballController::class, 'getBettingHistory'])->middleware('auth:sanctum');
    });

    // Betting routes
    Route::prefix('betting')->group(function () {
        Route::get('/balance', [BettingController::class, 'getBalance']);
        Route::get('/transactions', [BettingController::class, 'getTransactions']);
        Route::post('/deposit', [BettingController::class, 'deposit']);
        Route::post('/withdraw', [BettingController::class, 'withdraw']);
    });

    // Admin routes
    Route::middleware('admin')->prefix('admin')->group(function () {
        // Dashboard stats and analytics
        Route::get('/stats', [AdminController::class, 'getStats']);
        Route::get('/revenue', [AdminController::class, 'getRevenueData']);
        Route::get('/user-activity', [AdminController::class, 'getUserActivity']);
        Route::get('/top-users', [AdminController::class, 'getTopUsers']);
        
        // User management
        Route::get('/users', [AdminController::class, 'getUsers']);
        Route::get('/users/{user}/transactions', [AdminController::class, 'getUserTransactions']);
        Route::get('/users/{user}/bets', [AdminController::class, 'getUserBets']);
        Route::post('/agents', [AdminController::class, 'createAgent']);
        Route::post('/agents/{user}/add-points', [AdminController::class, 'addAgentPoints']);
        
        // Transaction management
        Route::get('/transactions/pending', [AdminController::class, 'getPendingTransactions']);
        Route::post('/transactions/{transaction}/approve', [AdminController::class, 'approveTransaction']);
        Route::post('/transactions/{transaction}/reject', [AdminController::class, 'rejectTransaction']);
        
        // Game management
        Route::post('/lottery/generate', [AdminController::class, 'generateLotteryResult']);
        Route::post('/matches/{match}/score', [AdminController::class, 'updateMatchScore']);
    });
});
