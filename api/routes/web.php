<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FoodCategoryController;
use App\Http\Controllers\FoodController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('me', [AuthController::class, 'me']);

    Route::apiResource('food', FoodController::class);
    Route::apiResource('food-categories', FoodCategoryController::class);
});
