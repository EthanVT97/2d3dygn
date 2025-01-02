<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateAdminUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:create';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create an admin user';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $user = User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'phone' => '1234567890',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'balance' => 0,
        ]);

        $this->info('Admin user created successfully!');
        $this->info('Email: admin@example.com');
        $this->info('Password: password');
    }
}
