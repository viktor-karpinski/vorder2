<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use App\Models\Meal;
use App\Models\Food;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('meal_food', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Meal::class)->constrained()->onDelete('cascade');
            $table->foreignIdFor(Food::class);
            $table->float('amount');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('meal_foods');
    }
};
