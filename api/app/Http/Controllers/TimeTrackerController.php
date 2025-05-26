<?php

namespace App\Http\Controllers;

use App\Models\TimeTracker;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TimeTrackerController extends Controller
{
    public function week(Request $request)
    {
        $request->validate([
            'from' => 'required|date',
            'till' => 'required|date'
        ]);

        $trackers = TimeTracker::where('user_id', Auth::user()->id)->where([
            ['from', '>=', $request->from],
            ['till', '<=', $request->till],
        ])->get();

        return response()->json([
            'trackers' => $trackers
        ], 200);
    }
}
