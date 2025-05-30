<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User;

class Food extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'label', 'visibility'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function macros()
    {
        return $this->hasMany(Macro::class);
    }

    public function micros()
    {
        return $this->hasMany(Micro::class);
    }

    public function mealFoods()
    {
        return $this->hasMany(MealFood::class);
    }

    public function categories()
    {
        return $this->belongsToMany(FoodCategory::class, 'food_category_links');
    }
}
