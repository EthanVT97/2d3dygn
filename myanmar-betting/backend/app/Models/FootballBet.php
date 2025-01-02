<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FootballBet extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'match_id',
        'bet_type',
        'selection',
        'amount',
        'odds',
        'potential_win',
        'status',
        'winning_amount',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'amount' => 'decimal:2',
        'odds' => 'decimal:2',
        'potential_win' => 'decimal:2',
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
     * Get the match associated with the bet.
     */
    public function match()
    {
        return $this->belongsTo(FootballMatch::class);
    }
}
