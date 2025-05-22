<?php

namespace App\Http\Controllers;

use App\Models\Routine;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoutineController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'date' => 'required|date'
        ]);

        $routines = Routine::where([
            ['user_id', Auth::user()->id],
            ['track_from', '<=', $request->date]
        ])->with('routine_trackers')->get();

        return response()->json([
            'routines' => $routines
        ], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|integer',
            'amount' => 'required|integer|min:1',
            'track_from' => 'required|date',
            'interval' => 'required|string',
            'color' => 'required|string|max:20',
        ]);

        $routine = Routine::create([
            'user_id' => Auth::id(),
            'title' => $validated['title'],
            'type' => $validated['type'],
            'amount' => $validated['amount'],
            'track_from' => $validated['track_from'],
            'interval' => $validated['interval'],
            'color' => $validated['color'],
            'streak' => 0,
        ]);

        return response()->json([
            'message' => 'Routine created successfully.',
            'routine' => $routine,
        ], 201);
    }
}
