<?php

use App\Http\Controllers\FoodCategoryController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::apiResource('food-categories', FoodCategoryController::class);
