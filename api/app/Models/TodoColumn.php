<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TodoColumn extends Model
{
    protected $fillable = [
        'board_column_id',
        'todo_id',
        'order',
    ];

    public function todo()
    {
        return $this->belongsTo(Todo::class);
    }
}
