<?php

namespace App\Http\Controllers;

use App\Models\BoardColumn;
use App\Models\Todo;
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
            }

            $todos = Todo::whereIn(
                'id',
                TodoFolder::where('workspace_folder_id', $folder->id)->pluck('todo_id')
            )->get();

            return response()->json([
                'folder' => $folder,
                'todos' => $todos,
            ], 200);
        }

        return response()->json([], 403);
    }
}
