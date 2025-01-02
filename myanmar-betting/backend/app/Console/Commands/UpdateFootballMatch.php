<?php

namespace App\Console\Commands;

use App\Models\FootballMatch;
use App\Services\FootballService;
use Illuminate\Console\Command;

class UpdateFootballMatch extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'football:update {match_id} {home_score} {away_score}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update football match score and process bets';

    /**
     * The football service instance.
     *
     * @var \App\Services\FootballService
     */
    protected $footballService;

    /**
     * Create a new command instance.
     */
    public function __construct(FootballService $footballService)
    {
        parent::__construct();
        $this->footballService = $footballService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $matchId = $this->argument('match_id');
        $homeScore = $this->argument('home_score');
        $awayScore = $this->argument('away_score');

        $match = FootballMatch::findOrFail($matchId);

        if ($match->status === 'finished') {
            $this->error('Match has already been finished!');
            return 1;
        }

        $this->footballService->updateMatchScore($match, $homeScore, $awayScore);

        $this->info("Updated match score: {$match->homeTeam->name} {$homeScore} - {$awayScore} {$match->awayTeam->name}");
        return 0;
    }
}
