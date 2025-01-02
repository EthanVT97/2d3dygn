<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LotteryResult extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'type',
        'number',
        'draw_time',
        'created_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'draw_time' => 'datetime',
    ];

    /**
     * Get the bets associated with this result.
     */
    public function bets()
    {
        return $this->hasMany(Bet::class, 'result_id');
    }

    /**
     * Get the admin user who created the result.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
