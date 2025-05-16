<?php

namespace App\Http\Controllers;

use App\Models\BoardColumn;
use App\Models\Todo;
use App\Models\TodoColumn;
use App\Models\TodoFolder;
use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceFolder;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WorkspaceController extends Controller
{
    public function index()
    {
        $workspaces = Workspace::where('user_id', Auth::user()->id)
            ->with('folders')
            ->get();

        return response()->json([
            'workspaces' => $workspaces
        ], 200);
    }

    public function create()
    {
        $workspace = new Workspace();
        $workspace->user_id = Auth::user()->id;
        $workspace->save();
        $workspace->refresh();

        return response()->json([
            'workspace' => $workspace
        ], 200);
    }

    public function createFolder(Workspace $workspace)
    {
        $folder = WorkspaceFolder::create([
            'user_id' => Auth::user()->id,
            'workspace_id' => $workspace->id,
        ]);

        $folder->refresh();

        return response()->json([
            'folder' => $folder
        ], 200);
    }

    public function createBoard(Workspace $workspace)
    {
        DB::beginTransaction();

        $board = WorkspaceFolder::create([
            'user_id' => Auth::id(),
            'title' => 'board',
            'type' => 1,
            'workspace_id' => $workspace->id,
        ]);

        $defaultColumns = [
            ['title' => 'Backlog', 'order' => 0],
            ['title' => 'In Progress', 'order' => 1],
            ['title' => 'Testing', 'order' => 2],
            ['title' => 'Done', 'order' => 3],
        ];

        foreach ($defaultColumns as $column) {
            $board->columns()->create($column);
        }

        $board->load('columns');

        DB::commit();

        return response()->json([
            'board' => $board
        ], 200);
    }


    public function setFolderTitle(WorkspaceFolder $folder, Request $request)
    {
        $folder->title = $request->title;
        $folder->save();

        return response()->json([], 200);
    }

    public function getFolder(WorkspaceFolder $folder)
    {
        if ($folder->user()->first()->id === Auth::user()->id) {

            if ($folder->type === 1) {
                $folder->load(['columns' => fn($q) => $q->orderBy('order')]);

                $todoColumns = TodoColumn::with('todo')
                    ->whereIn('board_column_id', $folder->columns->pluck('id'))
                    ->orderBy('order')
                    ->get();

                $todos = $todoColumns->map(function ($tc) {
                    $todo = $tc->todo;
                    $todo->columnId = $tc->board_column_id;
                    $todo->order = $tc->order;
                    return $todo;
                })->values();
            } else {
                $todoIds = TodoFolder::where('workspace_folder_id', $folder->id)->pluck('todo_id');

                $todos = Todo::whereIn('id', $todoIds)->get();
            }

            return response()->json([
                'folder' => $folder,
                'todos' => $todos,
            ], 200);
        }

        return response()->json([], 403);
    }

    public function reorderColumns(Request $request)
    {
        $validated = $request->validate([
            'columns' => 'required|array',
            'columns.*.id' => 'required|exists:board_columns,id',
            'columns.*.order' => 'required|integer',
        ]);

        foreach ($validated['columns'] as $columnData) {
            BoardColumn::where('id', $columnData['id'])->update([
                'order' => $columnData['order'],
            ]);
        }

        return response()->json(['message' => 'Column order updated'], 200);
    }

    public function createBoardTodo(Request $request, BoardColumn $column)
    {
        $todo = Todo::create([
            'workspace_id' => $column->board->workspace->id,
            'user_id' => Auth::user()->id,
            'title' => $request->title,
        ]);

        $todo->refresh();

        $maxOrder = TodoColumn::where('board_column_id', $column->id)->max('order');
        $order = is_null($maxOrder) ? 0 : $maxOrder + 1;

        TodoColumn::create([
            'board_column_id' => $column->id,
            'todo_id' => $todo->id,
            'order' => $order,
        ]);

        return response()->json([
            'todo' => [
                ...$todo->toArray(),
                'columnId' => $column->id,
                'order' => $order,
            ]
        ], 200);
    }
}
