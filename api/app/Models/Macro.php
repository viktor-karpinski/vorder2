<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Macro extends Model
{
    use HasFactory;

    protected $fillable = [
        'label',
        'user_id',
        'food_id',
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
