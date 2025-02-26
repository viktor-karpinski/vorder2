<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FoodCategoryLink extends Model
{
    use HasFactory;

    protected $fillable = ['food_id', 'food_category_id'];

    public function food()
    {
        return $this->belongsTo(Food::class);
    }

    public function category()
    {
        return $this->belongsTo(FoodCategory::class);
    }
}
