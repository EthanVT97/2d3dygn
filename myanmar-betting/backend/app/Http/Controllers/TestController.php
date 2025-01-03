<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use PDO;

class TestController extends Controller
{
    public function testConnection()
    {
        try {
            // Test direct PDO connection
            $pdo = new PDO(
                "pgsql:host=dpg-ctrnr6rtq21c738v55e0-a;port=5432;dbname=myanmar_betting_db;sslmode=require",
                "myanmar_betting_db_user",
                "BJequEHxb5HS39bp6yxQLvefUbbLrUfy"
            );
            
            $pdoStatus = "PDO Connection successful";
        } catch (\PDOException $e) {
            $pdoStatus = "PDO Error: " . $e->getMessage();
        }

        try {
            // Test Laravel DB connection
            DB::connection()->getPdo();
            $laravelStatus = "Laravel DB Connection successful. Database: " . DB::connection()->getDatabaseName();
        } catch (\Exception $e) {
            $laravelStatus = "Laravel Error: " . $e->getMessage();
        }

        return response()->json([
            'pdo_status' => $pdoStatus,
            'laravel_status' => $laravelStatus,
            'config' => [
                'host' => config('database.connections.pgsql.host'),
                'port' => config('database.connections.pgsql.port'),
                'database' => config('database.connections.pgsql.database'),
                'username' => config('database.connections.pgsql.username'),
                'sslmode' => config('database.connections.pgsql.sslmode')
            ]
        ]);
    }
}
