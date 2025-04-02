<?php

namespace App\Http\Controllers;

use App\Models\Food;
use App\Models\Macro;
use App\Models\Micro;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FoodController extends Controller
{
    public function index()
    {
        $foods = Food::with(['macros', 'micros', 'categories'])->get();
        return response()->json(['data' => $foods], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'label'         => 'required|string|max:255',
            'visibility'    => 'required|integer',
            'producer'      => 'required|string|max:255',
            'macros'        => 'required|array',
            'macros.kcal'   => 'required|integer',
            'macros.fat'    => 'required|numeric',
            'macros.saturated_fat'         => 'required|numeric',
            'macros.monounsaturated_fats'    => 'required|numeric',
            'macros.polyunsaturated_fats'    => 'required|numeric',
            'macros.trans_fats'              => 'required|numeric',
            'macros.carbs'                   => 'required|numeric',
            'macros.complex_carbs'           => 'required|numeric',
            'macros.simple_sugars'           => 'required|numeric',
            'macros.protein'                 => 'required|numeric',
            'macros.fibre'                   => 'required|numeric',
            'macros.salt'                    => 'required|numeric',

            'micros'        => 'sometimes|array',
            'micros.variation'               => 'nullable|string',
            'micros.vitamin_a'               => 'required_with:micros|numeric',
            'micros.vitamin_c'               => 'required_with:micros|numeric',
            'micros.vitamin_d'               => 'required_with:micros|numeric',
            'micros.vitamin_e'               => 'required_with:micros|numeric',
            'micros.vitamin_k'               => 'required_with:micros|numeric',
            'micros.vitamin_b1_thiamin'      => 'required_with:micros|numeric',
            'micros.vitamin_b2_riboflavin'   => 'required_with:micros|numeric',
            'micros.vitamin_b3_niacin'       => 'required_with:micros|numeric',
            'micros.vitamin_b5_pantothenic_acid' => 'required_with:micros|numeric',
            'micros.vitamin_b6_pyridoxine'   => 'required_with:micros|numeric',
            'micros.vitamin_b7_biotin'       => 'required_with:micros|numeric',
            'micros.vitamin_b9_folate'       => 'required_with:micros|numeric',
            'micros.vitamin_b12_cobalamine'  => 'required_with:micros|numeric',
            'micros.calcium'               => 'required_with:micros|numeric',
            'micros.iron'                  => 'required_with:micros|numeric',
            'micros.magnesium'             => 'required_with:micros|numeric',
            'micros.zinc'                  => 'required_with:micros|numeric',
            'micros.selenium'              => 'required_with:micros|numeric',
            'micros.potassium'             => 'required_with:micros|numeric',
            'micros.sodium'                => 'required_with:micros|numeric',
            'micros.phosphorus'            => 'required_with:micros|numeric',
            'micros.copper'                => 'required_with:micros|numeric',
            'micros.iodine'                => 'required_with:micros|numeric',
            'micros.manganese'             => 'required_with:micros|numeric',
            'micros.chromium'              => 'required_with:micros|numeric',
            'micros.molybdenum'            => 'required_with:micros|numeric',

            'food_categories'             => 'sometimes|array',
            'food_categories.*'           => 'exists:food_categories,id',
        ]);

        $food = Food::create([
            'user_id'    => Auth::user()->id,
            'label'      => $validated['label'],
            'visibility' => $validated['visibility'],
            'producer'   => $validated['producer'],
        ]);

        $macrosData = $validated['macros'];
        $macrosData['food_id'] = $food->id;
        $macrosData['user_id'] = Auth::user()->id;
        Macro::create($macrosData);

        if (isset($validated['micros'])) {
            $microsData = $validated['micros'];
            $microsData['food_id'] = $food->id;
            $microsData['user_id'] = Auth::user()->id;
            Micro::create($microsData);
        }

        if (isset($validated['food_categories'])) {
            $food->categories()->sync($validated['food_categories']);
        }

        return response()->json(['data' => $food->load(['macros', 'micros', 'categories'])], 201);
    }

    public function show(Food $food)
    {
        return response()->json(['data' => $food->load(['macros', 'micros', 'categories'])], 200);
    }

    public function update(Request $request, Food $food)
    {
        $validated = $request->validate([
            'label'         => 'sometimes|required|string|max:255',
            'visibility'    => 'sometimes|required|integer',
            'producer'      => 'sometimes|required|string|max:255',
            'macros'        => 'required|array',
            'macros.kcal'   => 'required|integer',
            'macros.fat'    => 'required|numeric',
            'macros.saturated_fat'         => 'required|numeric',
            'macros.monounsaturated_fats'    => 'required|numeric',
            'macros.polyunsaturated_fats'    => 'required|numeric',
            'macros.trans_fats'              => 'required|numeric',
            'macros.carbs'                   => 'required|numeric',
            'macros.complex_carbs'           => 'required|numeric',
            'macros.simple_sugars'           => 'required|numeric',
            'macros.protein'                 => 'required|numeric',
            'macros.fibre'                   => 'required|numeric',
            'macros.salt'                    => 'required|numeric',

            'micros'        => 'sometimes|array',
            'micros.variation'               => 'nullable|string',
            'micros.vitamin_a'               => 'required_with:micros|numeric',
            'micros.vitamin_c'               => 'required_with:micros|numeric',
            'micros.vitamin_d'               => 'required_with:micros|numeric',
            'micros.vitamin_e'               => 'required_with:micros|numeric',
            'micros.vitamin_k'               => 'required_with:micros|numeric',
            'micros.vitamin_b1_thiamin'      => 'required_with:micros|numeric',
            'micros.vitamin_b2_riboflavin'   => 'required_with:micros|numeric',
            'micros.vitamin_b3_niacin'       => 'required_with:micros|numeric',
            'micros.vitamin_b5_pantothenic_acid' => 'required_with:micros|numeric',
            'micros.vitamin_b6_pyridoxine'   => 'required_with:micros|numeric',
            'micros.vitamin_b7_biotin'       => 'required_with:micros|numeric',
            'micros.vitamin_b9_folate'       => 'required_with:micros|numeric',
            'micros.vitamin_b12_cobalamine'  => 'required_with:micros|numeric',
            'micros.calcium'               => 'required_with:micros|numeric',
            'micros.iron'                  => 'required_with:micros|numeric',
            'micros.magnesium'             => 'required_with:micros|numeric',
            'micros.zinc'                  => 'required_with:micros|numeric',
            'micros.selenium'              => 'required_with:micros|numeric',
            'micros.potassium'             => 'required_with:micros|numeric',
            'micros.sodium'                => 'required_with:micros|numeric',
            'micros.phosphorus'            => 'required_with:micros|numeric',
            'micros.copper'                => 'required_with:micros|numeric',
            'micros.iodine'                => 'required_with:micros|numeric',
            'micros.manganese'             => 'required_with:micros|numeric',
            'micros.chromium'              => 'required_with:micros|numeric',
            'micros.molybdenum'            => 'required_with:micros|numeric',

            'food_categories'             => 'sometimes|array',
            'food_categories.*'           => 'exists:food_categories,id',
        ]);

        $food->update($request->only(['label', 'visibility', 'producer']));

        $food->macros()->update($validated['macros']);

        if (isset($validated['micros'])) {
            if ($food->micros) {
                $food->micros()->update($validated['micros']);
            } else {
                $microsData = $validated['micros'];
                $microsData['food_id'] = $food->id;
                $microsData['user_id'] = Auth::user()->id;
                Micro::create($microsData);
            }
        }

        if (isset($validated['food_categories'])) {
            $food->categories()->sync($validated['food_categories']);
        }

        return response()->json(['data' => $food->load(['macros', 'micros', 'categories'])], 200);
    }

    public function destroy(Food $food)
    {
        $food->delete();
        return response()->json(['message' => 'Food deleted successfully'], 200);
    }
}
