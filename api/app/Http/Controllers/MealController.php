<?php

namespace App\Http\Controllers;

use App\Models\Meal;
use App\Models\MealFood;
use App\Models\TimeTracker;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MealController extends Controller
{
    public function index($date)
    {
        $today = Carbon::create($date);

        $meals = Meal::with(['timeTracker', 'mealFoods', 'mealFoods.food', 'mealFoods.macros', 'mealFoods.micros'])
            ->where('user_id', Auth::id())
            ->whereHas('timeTracker', function ($query) use ($today) {
                $query->whereDate('from', $today);
            })
            ->get();

        return response()->json([
            'meals' => $meals,
        ], 200);
    }

    public function start(Request $request)
    {
        $validated = $request->validate([
            'planned' => 'sometimes',
            'type' => 'required',
        ]);

        $timeTracker = TimeTracker::create([
            'user_id' => Auth::user()->id,
            'from'    => now(),
            'till'    => null,
            'planned' => $validated['planned'] ?? ''
        ]);

        $meal = Meal::create([
            'user_id'         => Auth::user()->id,
            'type'            => $request->type,
            'time_tracker_id' => $timeTracker->id,
        ]);

        return response()->json(['data' => $meal->load('timeTracker')], 201);
    }

    public function addFood(Request $request, Meal $meal)
    {
        if ($meal->user_id !== Auth::user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'food_id' => 'required|exists:food,id',
            'macro_id' => 'required|exists:macros,id',
            'micro_id' => 'required|exists:micros,id',
            'amount'  => 'required|numeric|min:0.1',
        ]);

        $mealFood = MealFood::create([
            'meal_id' => $meal->id,
            'food_id' => $validated['food_id'],
            'macros_id' => $validated['macro_id'],
            'micros_id' => $validated['micro_id'],
            'amount'  => $validated['amount'],
        ]);

        return response()->json(['data' => $mealFood], 201);
    }

    public function finish(Meal $meal)
    {
        if ($meal->user_id !== Auth::user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $timeTracker = $meal->timeTracker;
        if ($timeTracker && is_null($timeTracker->till)) {
            $timeTracker->update(['till' => now()]);
        }

        return response()->json(['data' => $meal->load('timeTracker')], 200);
    }

    public function show(Meal $meal)
    {
        if ($meal->user_id !== Auth::user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $meal->load('mealFoods.food.macros', 'mealFoods.food.micros');

        $totalMacros = [];
        $totalMicros = [];

        foreach ($meal->mealFoods as $mealFood) {
            $amount = $mealFood->amount;
            $food   = $mealFood->food;

            if ($food && $food->macros) {
                $macros = $food->macros->toArray();
                $exclude = ['id', 'food_id', 'user_id', 'variation', 'created_at', 'updated_at'];
                foreach ($macros as $key => $value) {
                    if (in_array($key, $exclude)) {
                        continue;
                    }
                    if (!isset($totalMacros[$key])) {
                        $totalMacros[$key] = 0;
                    }
                    $totalMacros[$key] += $value * $amount;
                }
            }

            if ($food && $food->micros) {
                $micros = $food->micros->toArray();
                $exclude = ['id', 'food_id', 'user_id', 'variation', 'created_at', 'updated_at'];
                foreach ($micros as $key => $value) {
                    if (in_array($key, $exclude)) {
                        continue;
                    }
                    if (!isset($totalMicros[$key])) {
                        $totalMicros[$key] = 0;
                    }
                    $totalMicros[$key] += $value * $amount;
                }
            }
        }

        return response()->json([
            'data'   => $meal,
            'totals' => [
                'macros' => $totalMacros,
                'micros' => $totalMicros,
            ]
        ], 200);
    }
}
