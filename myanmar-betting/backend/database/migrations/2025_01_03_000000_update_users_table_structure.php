<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Make email nullable
            $table->string('email')->nullable()->change();
            
            // Add role field if it doesn't exist
            if (!Schema::hasColumn('users', 'role')) {
                $table->string('role')->default('user')->after('is_admin');
            }
            
            // Ensure balance field exists with correct precision
            if (!Schema::hasColumn('users', 'balance')) {
                $table->decimal('balance', 12, 2)->default(0)->after('role');
            }
            
            // Ensure is_admin field exists
            if (!Schema::hasColumn('users', 'is_admin')) {
                $table->boolean('is_admin')->default(false)->after('password');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('email')->nullable(false)->change();
            $table->dropColumn(['role', 'balance', 'is_admin']);
        });
    }
};
