<?php

namespace App\Http\Controllers;

use App\Models\Food;
use App\Models\Macro;
use App\Models\Micro;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class FoodController extends Controller
{
    public function index()
    {
        $foods = DB::table('food')
            ->join('macros', 'macros.food_id', '=', 'food.id')
            ->leftJoin('micros', function ($join) {
                $join->on('micros.food_id', '=', 'macros.food_id')
                    ->on('micros.label', '=', 'macros.label');
            })
            ->select(
                'food.id as food_id',
                'food.label as food_label',
                'macros.id as macro_id',
                'macros.label as variation_label',
                'macros.kcal',
                'macros.fat',
                'macros.saturated_fat',
                'macros.monounsaturated_fats',
                'macros.polyunsaturated_fats',
                'macros.trans_fats',
                'macros.carbs',
                'macros.complex_carbs',
                'macros.simple_sugars',
                'macros.protein',
                'macros.fibre',
                'macros.salt',
                'micros.id as micro_id',
                'micros.vitamin_a',
                'micros.vitamin_c',
                'micros.vitamin_d',
                'micros.vitamin_e',
                'micros.vitamin_k',
                'micros.vitamin_b1_thiamin',
                'micros.vitamin_b2_riboflavin',
                'micros.vitamin_b3_niacin',
                'micros.vitamin_b5_pantothenic_acid',
                'micros.vitamin_b6_pyridoxine',
                'micros.vitamin_b7_biotin',
                'micros.vitamin_b9_folate',
                'micros.vitamin_b12_cobalamine',
                'micros.calcium',
                'micros.iron',
                'micros.magnesium',
                'micros.zinc',
                'micros.selenium',
                'micros.potassium',
                'micros.sodium',
                'micros.phosphorus',
                'micros.copper',
                'micros.iodine',
                'micros.manganese',
                'micros.chromium',
                'micros.molybdenum'
            )
            ->get();

        $flattened = $foods->map(function ($item) {
            return [
                'food_id' => $item->food_id,
                'variation_label' => $item->variation_label === 'OVERALL' ? $item->food_label : $item->variation_label,
                'macro_id' => $item->macro_id,
                'micro_id' => $item->micro_id,
                'macros' => [
                    'kcal' => $item->kcal,
                    'fat' => $item->fat,
                    'saturated_fat' => $item->saturated_fat,
                    'monounsaturated_fats' => $item->monounsaturated_fats,
                    'polyunsaturated_fats' => $item->polyunsaturated_fats,
                    'trans_fats' => $item->trans_fats,
                    'carbs' => $item->carbs,
                    'complex_carbs' => $item->complex_carbs,
                    'simple_sugars' => $item->simple_sugars,
                    'protein' => $item->protein,
                    'fibre' => $item->fibre,
                    'salt' => $item->salt,
                ],
                'micros' => $item->micro_id ? [
                    'vitamin_a' => $item->vitamin_a,
                    'vitamin_c' => $item->vitamin_c,
                    'vitamin_d' => $item->vitamin_d,
                    'vitamin_e' => $item->vitamin_e,
                    'vitamin_k' => $item->vitamin_k,
                    'vitamin_b1_thiamin' => $item->vitamin_b1_thiamin,
                    'vitamin_b2_riboflavin' => $item->vitamin_b2_riboflavin,
                    'vitamin_b3_niacin' => $item->vitamin_b3_niacin,
                    'vitamin_b5_pantothenic_acid' => $item->vitamin_b5_pantothenic_acid,
                    'vitamin_b6_pyridoxine' => $item->vitamin_b6_pyridoxine,
                    'vitamin_b7_biotin' => $item->vitamin_b7_biotin,
                    'vitamin_b9_folate' => $item->vitamin_b9_folate,
                    'vitamin_b12_cobalamine' => $item->vitamin_b12_cobalamine,
                    'calcium' => $item->calcium,
                    'iron' => $item->iron,
                    'magnesium' => $item->magnesium,
                    'zinc' => $item->zinc,
                    'selenium' => $item->selenium,
                    'potassium' => $item->potassium,
                    'sodium' => $item->sodium,
                    'phosphorus' => $item->phosphorus,
                    'copper' => $item->copper,
                    'iodine' => $item->iodine,
                    'manganese' => $item->manganese,
                    'chromium' => $item->chromium,
                    'molybdenum' => $item->molybdenum,
                ] : null,
            ];
        });

        return response()->json(['food' => $flattened], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'label'         => 'required|string|max:255',
            'visibility'    => 'required|integer',
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
        ]);

        $macrosData = $validated['macros'];
        $macrosData['food_id'] = $food->id;
        $macrosData['user_id'] = Auth::user()->id;
        $macrosData['label'] = $request->producer;
        Macro::create($macrosData);

        if (isset($validated['micros'])) {
            $microsData = $validated['micros'];
            $microsData['food_id'] = $food->id;
            $microsData['user_id'] = Auth::user()->id;
            $microsData['label'] = $request->producer;
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

        $food->update($request->only(['label', 'visibility']));

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
