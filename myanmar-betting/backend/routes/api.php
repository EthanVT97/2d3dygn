<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\BettingController;
use App\Http\Controllers\FootballController;
use App\Http\Controllers\LotteryController;
use Illuminate\Support\Facades\Route;

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
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Lottery routes
    Route::prefix('lottery')->group(function () {
        // 2D routes
        Route::get('/2d/results', [LotteryController::class, 'getTwoDResults']);
        Route::post('/2d/bet', [LotteryController::class, 'placeTwoDBet']);
        Route::get('/2d/history', [LotteryController::class, 'getTwoDHistory']);

        // 3D routes
        Route::get('/3d/results', [LotteryController::class, 'getThreeDResults']);
        Route::post('/3d/bet', [LotteryController::class, 'placeThreeDBet']);
        Route::get('/3d/history', [LotteryController::class, 'getThreeDHistory']);

        // Thai lottery routes
        Route::get('/thai/results', [LotteryController::class, 'getThaiResults']);
        Route::post('/thai/bet', [LotteryController::class, 'placeThaiLotteryBet']);
        Route::get('/thai/history', [LotteryController::class, 'getThaiHistory']);
    });

    // Football routes
    Route::prefix('football')->group(function () {
        Route::get('/matches', [FootballController::class, 'getMatches']);
        Route::get('/matches/{match}', [FootballController::class, 'getMatch']);
        Route::post('/bet', [FootballController::class, 'placeBet']);
        Route::get('/bets', [FootballController::class, 'getBets']);
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
