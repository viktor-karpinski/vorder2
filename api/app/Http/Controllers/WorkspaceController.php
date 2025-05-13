<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceFolder;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

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
}
