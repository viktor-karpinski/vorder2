<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User;

class Meal extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'time_tracker_id', 'type'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function timeTracker()
    {
        return $this->belongsTo(TimeTracker::class);
    }

    public function mealFoods()
    {
        return $this->hasMany(MealFood::class);
    }
}
