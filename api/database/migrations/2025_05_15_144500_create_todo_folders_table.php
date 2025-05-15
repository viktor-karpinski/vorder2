<?php

use App\Models\Todo;
use App\Models\WorkspaceFolder;
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
        Schema::create('todo_folders', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(WorkspaceFolder::class)->constrained()->onDelete('cascade');
            $table->foreignIdFor(Todo::class)->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('todo_folders');
    }
};
