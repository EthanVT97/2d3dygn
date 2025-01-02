<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class League extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'country',
        'logo_url',
    ];

    /**
     * Get the matches in this league.
     */
    public function matches()
    {
        return $this->hasMany(FootballMatch::class);
    }
}
