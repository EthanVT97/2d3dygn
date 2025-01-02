<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use PDO;

class CreateDatabase extends Command
{
    protected $signature = 'db:create';
    protected $description = 'Create a new MySQL database based on config file';

    public function handle()
    {
        $database = 'betting_db';
        $charset = config("database.connections.mysql.charset", 'utf8mb4');
        $collation = config("database.connections.mysql.collation", 'utf8mb4_unicode_ci');

        try {
            $pdo = new PDO(
                'mysql:host=127.0.0.1',
                'root',
                ''
            );

            $pdo->exec("CREATE DATABASE IF NOT EXISTS `$database` CHARACTER SET `$charset` COLLATE `$collation`;")
                || $this->error(print_r($pdo->errorInfo(), true));

            $this->info("Successfully created database: $database");
            return 0;
        } catch (\Exception $e) {
            $this->error($e->getMessage());
            return 1;
        }
    }
}
