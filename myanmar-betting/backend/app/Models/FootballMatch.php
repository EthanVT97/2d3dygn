<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FootballMatch extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'home_team_id',
        'away_team_id',
        'league_id',
        'start_time',
        'status',
        'home_score',
        'away_score',
        'created_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'start_time' => 'datetime',
        'home_score' => 'integer',
        'away_score' => 'integer',
    ];

    /**
     * Get the home team.
     */
    public function homeTeam()
    {
        return $this->belongsTo(Team::class, 'home_team_id');
    }

    /**
     * Get the away team.
     */
    public function awayTeam()
    {
        return $this->belongsTo(Team::class, 'away_team_id');
    }

    /**
     * Get the league.
     */
    public function league()
    {
        return $this->belongsTo(League::class);
    }

    /**
     * Get the match odds.
     */
    public function odds()
    {
        return $this->hasMany(MatchOdds::class);
    }

    /**
     * Get the match statistics.
     */
    public function statistics()
    {
        return $this->hasOne(MatchStatistics::class);
    }

    /**
     * Get the bets placed on this match.
     */
    public function bets()
    {
        return $this->hasMany(FootballBet::class, 'match_id');
    }

    /**
     * Get the admin user who created the match.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
