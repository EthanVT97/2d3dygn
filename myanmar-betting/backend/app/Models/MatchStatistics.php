<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MatchStatistics extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'match_id',
        'home_possession',
        'away_possession',
        'home_shots',
        'away_shots',
        'home_shots_on_target',
        'away_shots_on_target',
        'home_corners',
        'away_corners',
        'home_fouls',
        'away_fouls',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'home_possession' => 'integer',
        'away_possession' => 'integer',
        'home_shots' => 'integer',
        'away_shots' => 'integer',
        'home_shots_on_target' => 'integer',
        'away_shots_on_target' => 'integer',
        'home_corners' => 'integer',
        'away_corners' => 'integer',
        'home_fouls' => 'integer',
        'away_fouls' => 'integer',
    ];

    /**
     * Get the match that owns the statistics.
     */
    public function match()
    {
        return $this->belongsTo(FootballMatch::class);
    }
}
