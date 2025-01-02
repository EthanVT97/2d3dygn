<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'name' => 'Admin',
            'phone' => '09123456789',
            'password' => Hash::make('admin123'),
            'is_admin' => true,
            'balance' => 1000000.00, // 1 million initial balance
        ]);
    }
}
