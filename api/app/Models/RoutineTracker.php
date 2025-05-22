<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoutineTracker extends Model
{
    use HasFactory;

    protected $fillable = [
        'routine_id',
        'date',
        'counter',
        'complete',
    ];

    protected $casts = [
        'date' => 'date',
        'complete' => 'boolean',
    ];

    public function routine()
    {
        return $this->belongsTo(Routine::class);
    }
}
