<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Micro extends Model
{
    use HasFactory;

    protected $fillable = [
        'label',
        'user_id',
        'food_id',
        'vitamin_a',
        'vitamin_c',
        'vitamin_d',
        'vitamin_e',
        'vitamin_k',
        'vitamin_b1_thiamin',
        'vitamin_b2_riboflavin',
        'vitamin_b3_niacin',
        'vitamin_b5_pantothenic_acid',
        'vitamin_b6_pyridoxine',
        'vitamin_b7_biotin',
        'vitamin_b9_folate',
        'vitamin_b12_cobalamine',
        'calcium',
        'iron',
        'magnesium',
        'zinc',
        'selenium',
        'potassium',
        'sodium',
        'phosphorus',
        'copper',
        'iodine',
        'manganese',
        'chromium',
        'molybdenum'
    ];

    public function food()
    {
        return $this->belongsTo(Food::class);
    }
}
