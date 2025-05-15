<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BoardColumn extends Model
{
    protected $fillable = ['workspace_folder_id', 'title', 'order'];

    public function board()
    {
        return $this->belongsTo(WorkspaceFolder::class);
    }
}
