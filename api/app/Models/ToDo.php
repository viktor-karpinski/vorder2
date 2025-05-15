<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Todo extends Model
{
    protected $fillable = [
        'workspace_id',
        'title',
        'deadline',
        'done',
        'user_id',
    ];
}
