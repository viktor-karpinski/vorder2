<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Foundation\Auth\User;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('time_trackers', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class)->constrained()->onDelete('cascade');
            $table->dateTime('from');
            $table->dateTime('till');
            $table->tinyInteger('planned');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('time_trackers');
    }
};
