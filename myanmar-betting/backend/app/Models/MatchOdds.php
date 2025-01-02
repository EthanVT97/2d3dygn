<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MatchOdds extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'match_id',
        'type',
        'selection',
        'odds',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'odds' => 'decimal:2',
    ];

    /**
     * Get the match that owns the odds.
     */
    public function match()
    {
        return $this->belongsTo(FootballMatch::class);
    }
}
