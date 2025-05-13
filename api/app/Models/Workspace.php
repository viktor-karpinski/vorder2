<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Workspace extends Model
{
    protected $fillable = [
        'title',
        'user_id',
        'shared',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
