<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MealFood extends Model
{
    use HasFactory;

    protected $fillable = ['meal_id', 'food_id', 'macros_id', 'micros_id', 'amount'];

    public function meal()
    {
        return $this->belongsTo(Meal::class);
    }

    public function macros()
    {
        return $this->belongsTo(Macro::class, 'macros_id');
    }

    public function micros()
    {
        return $this->belongsTo(Micro::class, 'micros_id');
    }

    public function food()
    {
        return $this->belongsTo(Food::class, 'food_id');
    }
}
