<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Create leagues table
        Schema::create('leagues', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('country');
            $table->string('logo_url')->nullable();
            $table->timestamps();
        });

        // Create teams table
        Schema::create('teams', function (Blueprint $table) {
            $table->id();
            $table->foreignId('league_id')->constrained('leagues')->onDelete('cascade');
            $table->string('name');
            $table->string('logo_url')->nullable();
            $table->timestamps();
        });

        // Create football matches table
        Schema::create('football_matches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('home_team_id')->constrained('teams');
            $table->foreignId('away_team_id')->constrained('teams');
            $table->foreignId('league_id')->constrained('leagues');
            $table->timestamp('start_time');
            $table->enum('status', ['scheduled', 'live', 'finished', 'cancelled'])->default('scheduled');
            $table->integer('home_score')->nullable();
            $table->integer('away_score')->nullable();
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
        });

        // Create match odds table
        Schema::create('match_odds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('match_id')->constrained('football_matches')->onDelete('cascade');
            $table->enum('type', ['win', 'draw', 'handicap', 'over_under']);
            $table->string('selection');
            $table->decimal('odds', 6, 2);
            $table->timestamps();
        });

        // Create match statistics table
        Schema::create('match_statistics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('match_id')->constrained('football_matches')->onDelete('cascade');
            $table->integer('home_possession')->nullable();
            $table->integer('away_possession')->nullable();
            $table->integer('home_shots')->nullable();
            $table->integer('away_shots')->nullable();
            $table->integer('home_shots_on_target')->nullable();
            $table->integer('away_shots_on_target')->nullable();
            $table->integer('home_corners')->nullable();
            $table->integer('away_corners')->nullable();
            $table->integer('home_fouls')->nullable();
            $table->integer('away_fouls')->nullable();
            $table->timestamps();
        });

        // Create football bets table
        Schema::create('football_bets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('match_id')->constrained('football_matches');
            $table->enum('bet_type', ['win', 'draw', 'handicap', 'over_under']);
            $table->string('selection');
            $table->decimal('amount', 12, 2);
            $table->decimal('odds', 6, 2);
            $table->decimal('potential_win', 12, 2);
            $table->enum('status', ['pending', 'won', 'lost', 'void'])->default('pending');
            $table->decimal('winning_amount', 12, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('football_bets');
        Schema::dropIfExists('match_statistics');
        Schema::dropIfExists('match_odds');
        Schema::dropIfExists('football_matches');
        Schema::dropIfExists('teams');
        Schema::dropIfExists('leagues');
    }
};
