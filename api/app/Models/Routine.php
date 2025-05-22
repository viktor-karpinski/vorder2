<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Routine extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'type',
        'amount',
        'streak',
        'track_from',
        'interval',
        'color',
    ];

    protected $casts = [
        'track_from' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function routine_trackers()
    {
        return $this->hasMany(RoutineTracker::class);
    }
}
