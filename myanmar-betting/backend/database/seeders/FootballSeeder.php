<?php

namespace Database\Seeders;

use App\Models\League;
use App\Models\Team;
use Illuminate\Database\Seeder;

class FootballSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Create Premier League
        $premierLeague = League::create([
            'name' => 'Premier League',
            'country' => 'England',
            'logo_url' => 'https://example.com/premier-league.png',
        ]);

        // Create Premier League teams
        $premierLeagueTeams = [
            'Arsenal',
            'Aston Villa',
            'Chelsea',
            'Liverpool',
            'Manchester City',
            'Manchester United',
            'Newcastle United',
            'Tottenham Hotspur',
        ];

        foreach ($premierLeagueTeams as $teamName) {
            Team::create([
                'name' => $teamName,
                'league_id' => $premierLeague->id,
                'logo_url' => 'https://example.com/' . strtolower(str_replace(' ', '-', $teamName)) . '.png',
            ]);
        }

        // Create La Liga
        $laLiga = League::create([
            'name' => 'La Liga',
            'country' => 'Spain',
            'logo_url' => 'https://example.com/la-liga.png',
        ]);

        // Create La Liga teams
        $laLigaTeams = [
            'Atletico Madrid',
            'Barcelona',
            'Real Madrid',
            'Sevilla',
            'Valencia',
            'Villarreal',
        ];

        foreach ($laLigaTeams as $teamName) {
            Team::create([
                'name' => $teamName,
                'league_id' => $laLiga->id,
                'logo_url' => 'https://example.com/' . strtolower(str_replace(' ', '-', $teamName)) . '.png',
            ]);
        }

        // Create Bundesliga
        $bundesliga = League::create([
            'name' => 'Bundesliga',
            'country' => 'Germany',
            'logo_url' => 'https://example.com/bundesliga.png',
        ]);

        // Create Bundesliga teams
        $bundesligaTeams = [
            'Bayern Munich',
            'Borussia Dortmund',
            'RB Leipzig',
            'Bayer Leverkusen',
            'Eintracht Frankfurt',
            'Wolfsburg',
        ];

        foreach ($bundesligaTeams as $teamName) {
            Team::create([
                'name' => $teamName,
                'league_id' => $bundesliga->id,
                'logo_url' => 'https://example.com/' . strtolower(str_replace(' ', '-', $teamName)) . '.png',
            ]);
        }
    }
}
