<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use App\Models\Food;
use App\Models\FoodCategory;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('food_category_links', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Food::class)->constrained()->onDelete('cascade');
            $table->foreignIdFor(FoodCategory::class)->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('food_category_links');
    }
};
