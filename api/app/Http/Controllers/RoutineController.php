<?php

namespace App\Http\Controllers;

use App\Models\Routine;
use App\Models\RoutineTracker;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class RoutineController extends Controller
{

    public function index(Request $request)
    {
        $request->validate([
            'date' => 'required|date'
        ]);

        $user = Auth::user();
        $date = Carbon::parse($request->date);
        $dayOfWeek = strtolower(substr($date->format('D'), 0, 2));

        $startOfWeek = $date->copy()->startOfWeek(Carbon::SUNDAY);
        $endOfWeek = $date->copy()->endOfWeek(Carbon::SATURDAY);

        $routines = Routine::where('user_id', $user->id)
            ->where('track_from', '<=', $date)
            ->with(['routine_trackers' => function ($query) use ($date) {
                $query->whereDate('date', $date->toDateString());
            }])
            ->get()
            ->filter(function ($routine) use ($date, $dayOfWeek, $startOfWeek, $endOfWeek) {
                $interval = $routine->interval;

                if ($interval === 'daily') return true;

                if ($interval === 'every other day') {
                    $lastComplete = RoutineTracker::where('routine_id', $routine->id)
                        ->where('complete', true)
                        ->where('date', '<', $date->toDateString())
                        ->orderByDesc('date')
                        ->first();

                    if (!$lastComplete) return true;

                    $daysAgo = Carbon::parse($lastComplete->date)->diffInDays($date);
                    return $daysAgo >= 2;
                }


                if (preg_match('/^mo(,tu|,we|,th|,fr|,sa|,so)*$/', $interval)) {
                    $days = explode(',', $interval);
                    return in_array($dayOfWeek, $days);
                }

                if (Str::endsWith($interval, 'a week')) {
                    $max = match ($interval) {
                        'once a week' => 1,
                        'twice a week' => 2,
                        '3 times a week' => 3,
                        '4 times a week' => 4,
                        '5 times a week' => 5,
                        default => null
                    };

                    if ($max === null) return false;

                    // Has a tracker today? Always show it.
                    $hasTrackerToday = $routine->routine_trackers
                        ->firstWhere('date', $date->toDateString());

                    if ($hasTrackerToday) return true;

                    // Count completed this week
                    $countThisWeek = RoutineTracker::where('routine_id', $routine->id)
                        ->whereBetween('date', [
                            $startOfWeek->toDateString(),
                            $endOfWeek->toDateString()
                        ])
                        ->count();

                    return $countThisWeek < $max;
                }



                return false;
            })
            ->values();

        return response()->json([
            'routines' => $routines
        ], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:0,1,2,3',
            'amount' => 'required|integer',
            'track_from' => 'required|date',
            'interval' => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    $validNamed = ['daily', 'every other day', 'once a week', 'twice a week', '3 times a week', '4 times a week', '5 times a week'];

                    $validDays = ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'so'];
                    $days = explode(',', $value);

                    if (in_array($value, $validNamed)) return;
                    if (count(array_diff($days, $validDays)) === 0) return;

                    $fail('The interval must be a valid named interval or a comma-separated day list like mo,tu,we.');
                }
            ],
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


    public function track(Request $request, Routine $routine)
    {
        $validated = $request->validate([
            'date' => 'nullable|date',
            'amount' => 'nullable|integer|min:0',
        ]);

        $date = $validated['date'] ?? now()->toDateString();
        $increment = $validated['amount'] ?? 1;

        $tracker = $routine->routine_trackers()->firstOrNew(['date' => $date]);

        $tracker->counter = $increment;

        switch ($routine->type) {
            case 0:
                $tracker->complete = ($tracker->counter >= $routine->amount);
                break;
            case 1:
                $tracker->complete = ($tracker->counter === 1);
                break;
            case 2:
                if ($routine->amount === -1) {
                    $tracker->complete = false;
                } else {
                    $tracker->complete = ($tracker->counter <= $routine->amount);
                }
                break;
            case 3:
                $tracker->complete = ($tracker->counter >= $routine->amount);
                break;
            default:
                return response()->json(['error' => 'Invalid routine type.'], 422);
        }

        $tracker->save();

        if ($tracker->complete) {
            $prevDate = $this->getPreviousValidTrackingDate($routine, Carbon::create($date));

            $prev = RoutineTracker::where([
                ['routine_id', $routine->id],
                ['complete', 1],
                ['date', $prevDate]
            ])->get();
            $routine->streak = ($prev->count() > 0) ? $routine->streak + 1 : 1;
            $routine->save();
        }

        return response()->json([
            'message' => 'Routine tracked successfully.',
            'tracker' => $tracker
        ], 200);
    }


    protected function getPreviousValidTrackingDate(Routine $routine, Carbon $date): ?Carbon
    {
        $interval = $routine->interval;
        $prev = $date->copy()->subDay();

        while ($prev->gte(Carbon::parse($routine->track_from))) {
            $valid = false;

            if ($interval === 'daily') {
                $valid = true;
            } elseif ($interval === 'every other day') {
                $lastTracker = $routine->routine_trackers->where('date', '<', $date->toDateString())->sortByDesc('date')->first();
                if ($lastTracker) {
                    $diff = Carbon::parse($lastTracker->date)->diffInDays($date);
                    if ($diff >= 2) $valid = true;
                } else {
                    $valid = true;
                }
            } elseif (preg_match('/^mo(,tu|,we|,th|,fr|,sa|,so)*$/', $interval)) {
                $days = explode(',', $interval);
                $day = strtolower(substr($prev->format('D'), 0, 2));
                if (in_array($day, $days)) $valid = true;
            } elseif (Str::endsWith($interval, 'a week')) {
                $valid = true;
            }

            if ($valid) return $prev;
            $prev->subDay();
        }

        return null;
    }
}
