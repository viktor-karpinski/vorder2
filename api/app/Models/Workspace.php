<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Workspace extends Model
{
    protected $fillable = [
        'title',
        'user_id',
        'shared',
        'is_main'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function folders()
    {
        return $this->hasMany(WorkspaceFolder::class);
    }
}
