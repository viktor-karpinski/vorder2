<?php

use App\Models\BoardColumn;
use App\Models\Todo;
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
        Schema::create('todo_columns', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(BoardColumn::class)->constrained()->onDelete('cascade');
            $table->foreignIdFor(Todo::class)->constrained()->onDelete('cascade');
            $table->integer('order');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('todo_columns');
    }
};
