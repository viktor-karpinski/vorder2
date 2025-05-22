<?php

use App\Models\Routine;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('routine_trackers', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Routine::class)->constrained()->onDelete('cascade');
            $table->date('date');
            $table->integer('counter')->default(1);
            $table->boolean('complete')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('routine_trackers');
    }
};
