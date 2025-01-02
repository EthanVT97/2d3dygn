<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bet extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'type',
        'number',
        'amount',
        'status',
        'result_id',
        'winning_amount',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'amount' => 'decimal:2',
        'winning_amount' => 'decimal:2',
    ];

    /**
     * Get the user that owns the bet.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the lottery result associated with the bet.
     */
    public function result()
    {
        return $this->belongsTo(LotteryResult::class, 'result_id');
    }
}
