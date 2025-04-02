<?php

namespace App\Http\Controllers;

use App\Models\FoodCategory;
use App\Models\FoodCategoryLink;
use Illuminate\Http\Request;

class FoodCategoryController extends Controller
{
    public function index()
    {
        $categories = FoodCategory::all();
        return response()->json([
            'data' => $categories
        ], 200);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'label'       => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        FoodCategory::create($validatedData);

        return response()->json([], 200);
    }

    public function show(FoodCategory $foodCategory)
    {
        return response()->json([
            'data' => $foodCategory
        ], 200);
    }

    public function update(Request $request, FoodCategory $foodCategory)
    {
        $validatedData = $request->validate([
            'label'       => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
        ]);

        $foodCategory->update($validatedData);

        return response()->json([], 200);
    }

    public function destroy(FoodCategory $foodCategory)
    {
        $foodCategory->delete();

        return response()->json([], 200);
    }
}
