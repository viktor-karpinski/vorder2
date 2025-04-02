<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use App\Models\Food;
use App\Models\User;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('macros', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Food::class)->constrained()->onDelete('cascade');
            $table->foreignIdFor(User::class)->constrained();
            $table->string('variation')->default("");
            $table->integer('kcal');
            $table->decimal('fat', 8, 2);
            $table->decimal('saturated_fat', 8, 2);
            $table->decimal('monounsaturated_fats', 8, 2);
            $table->decimal('polyunsaturated_fats', 8, 2);
            $table->decimal('trans_fats', 8, 2);
            $table->decimal('carbs', 8, 2);
            $table->decimal('complex_carbs', 8, 2);
            $table->decimal('simple_sugars', 8, 2);
            $table->decimal('protein', 8, 2);
            $table->decimal('fibre', 8, 2);
            $table->decimal('salt', 8, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('macros');
    }
};
