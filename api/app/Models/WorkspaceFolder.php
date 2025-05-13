<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkspaceFolder extends Model
{
    protected $fillable = [
        'title',
        'user_id',
        'workspace_id',
        'workspace_folder_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function workspace()
    {
        return $this->belongsTo(Workspace::class);
    }
}
