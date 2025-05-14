<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FoodCategoryController;
use App\Http\Controllers\FoodController;
use App\Http\Controllers\MealController;
use App\Http\Controllers\WorkspaceController;
use App\Models\Workspace;
use Illuminate\Support\Facades\Route;

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('me', [AuthController::class, 'me']);

    Route::apiResource('food', FoodController::class);
    Route::apiResource('food-categories', FoodCategoryController::class);

    Route::get('meals', [MealController::class, 'index']);
    Route::post('meals/start', [MealController::class, 'start']);
    Route::post('meals/{meal}/foods', [MealController::class, 'addFood']);
    Route::post('meals/{meal}/finish', [MealController::class, 'finish']);
    Route::get('meals/{meal}', [MealController::class, 'show']);

    Route::get('workspaces', [WorkspaceController::class, 'index']);
    Route::post('workspace', [WorkspaceController::class, 'create']);

    Route::post('workspace/{workspace}/folder', [WorkspaceController::class, 'createFolder']);
    Route::post('folder/{folder}/title', [WorkspaceController::class, 'setFolderTitle']);
});
