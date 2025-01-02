<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, drop the existing enum constraint
        DB::statement("ALTER TABLE transactions MODIFY COLUMN type ENUM('deposit', 'withdrawal', 'bet', 'winning', 'refund', 'admin_deposit')");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert back to original enum values
        DB::statement("ALTER TABLE transactions MODIFY COLUMN type ENUM('deposit', 'withdrawal', 'bet', 'winning', 'refund')");
    }
};
