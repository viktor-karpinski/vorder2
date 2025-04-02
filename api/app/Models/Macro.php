<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Macro extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'food_id',
        'variation',
        'kcal',
        'fat',
        'saturated_fat',
        'monounsaturated_fats',
        'polyunsaturated_fats',
        'trans_fats',
        'carbs',
        'complex_carbs',
        'simple_sugars',
        'protein',
        'fibre',
        'salt'
    ];

    public function food()
    {
        return $this->belongsTo(Food::class);
    }
}
