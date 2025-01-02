<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Team extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'logo_url',
        'league_id',
    ];

    /**
     * Get the league that owns the team.
     */
    public function league(): BelongsTo
    {
        return $this->belongsTo(League::class);
    }

    /**
     * Get the home matches for the team.
     */
    public function homeMatches()
    {
        return $this->hasMany(FootballMatch::class, 'home_team_id');
    }

    /**
     * Get the away matches for the team.
     */
    public function awayMatches()
    {
        return $this->hasMany(FootballMatch::class, 'away_team_id');
    }

    /**
     * Get all matches for the team (both home and away).
     */
    public function allMatches()
    {
        return FootballMatch::where('home_team_id', $this->id)
            ->orWhere('away_team_id', $this->id);
    }
}
