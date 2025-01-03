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
        // First, alter the column type to use a new enum
        DB::statement("ALTER TABLE transactions ALTER COLUMN type TYPE varchar USING type::varchar");
        DB::statement("DROP TYPE IF EXISTS transaction_type");
        DB::statement("CREATE TYPE transaction_type AS ENUM('deposit', 'withdrawal', 'bet', 'winning', 'refund', 'admin_deposit')");
        DB::statement("ALTER TABLE transactions ALTER COLUMN type TYPE transaction_type USING type::transaction_type");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Convert back to the original enum type
        DB::statement("ALTER TABLE transactions ALTER COLUMN type TYPE varchar USING type::varchar");
        DB::statement("DROP TYPE IF EXISTS transaction_type");
        DB::statement("CREATE TYPE transaction_type AS ENUM('deposit', 'withdrawal', 'bet', 'winning', 'refund')");
        DB::statement("ALTER TABLE transactions ALTER COLUMN type TYPE transaction_type USING type::transaction_type");
    }
};
