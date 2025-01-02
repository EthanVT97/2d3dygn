<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Match extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'time',
        'home_team_name',
        'home_team_logo',
        'home_team_score',
        'away_team_name',
        'away_team_logo',
        'away_team_score',
        'venue',
        'status',
        'odds_home_win',
        'odds_draw',
        'odds_away_win'
    ];

    protected $casts = [
        'date' => 'date',
        'home_team_score' => 'integer',
        'away_team_score' => 'integer',
        'odds_home_win' => 'float',
        'odds_draw' => 'float',
        'odds_away_win' => 'float'
    ];

    public function bets()
    {
        return $this->hasMany(Bet::class);
    }
}
