<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use App\Models\Food;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('micros', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Food::class)->constrained()->onDelete('cascade');
            $table->decimal('vitamin_a', 8, 2);
            $table->decimal('vitamin_c', 8, 2);
            $table->decimal('vitamin_d', 8, 2);
            $table->decimal('vitamin_e', 8, 2);
            $table->decimal('vitamin_k', 8, 2);
            $table->decimal('vitamin_b1_thiamin', 8, 2);
            $table->decimal('vitamin_b2_riboflavin', 8, 2);
            $table->decimal('vitamin_b3_niacin', 8, 2);
            $table->decimal('vitamin_b5_pantothenic_acid', 8, 2);
            $table->decimal('vitamin_b6_pyridoxine', 8, 2);
            $table->decimal('vitamin_b7_biotin', 8, 2);
            $table->decimal('vitamin_b9_folate', 8, 2);
            $table->decimal('vitamin_b12_cobalamine', 8, 2);
            $table->decimal('calcium', 8, 2);
            $table->decimal('iron', 8, 2);
            $table->decimal('magnesium', 8, 2);
            $table->decimal('zinc', 8, 2);
            $table->decimal('selenium', 8, 2);
            $table->decimal('potassium', 8, 2);
            $table->decimal('sodium', 8, 2);
            $table->decimal('phosphorus', 8, 2);
            $table->decimal('copper', 8, 2);
            $table->decimal('iodine', 8, 2);
            $table->decimal('manganese', 8, 2);
            $table->decimal('chromium', 8, 2);
            $table->decimal('molybdenum', 8, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('micros');
    }
};
