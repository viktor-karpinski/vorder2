"use client"

import { useApi } from "@/api";
import CalendarNavigation from "@/components/CalendarNavigation";
import { useAppContext, useWorkspaceContext } from "@/context";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Navigation from "@/components/Navigation";
import RoutineTracker from "@/components/Workspace/RoutineTracker";

const Layout = ({params, children}) => {
    const { get, post } = useApi();
    const { date } = useAppContext();
    const { workspaces, setWorkspaces, setActiveWorkspace, activeWorkspace } = useWorkspaceContext();

    const [sideBarTab, setSideBarTab] = useState('routines')

    const [routines, setRoutines] = useState([])

    const router = useRouter();

    const getWorkspaces = async () => {
        const response = await get('workspaces');

        if (response.ok) {
            const data = await response.json();
            console.log(data.workspaces);
            setWorkspaces(data.workspaces);

            if (activeWorkspace === null || activeWorkspace == {} || activeWorkspace === undefined) {
                const local = localStorage.getItem('workspace')
                if (local !== null || local !== undefined) {
                    setActiveWorkspace(JSON.parse(local))
                }
            }
        } else {
            console.error('Failed to fetch Workspaces:', response.status);
        }
    }

    const getRoutines = async () => {
        const response = await get(`routine?date=${date}`);

        if (response.ok) {
            const data = await response.json();
            console.log(data.routines);
            setRoutines(data.routines);

            
        } else {
            console.error('Failed to fetch Routines:', response);
        }
    }

    useEffect(() => {
        switch (sideBarTab) {
            case 'routines':
                getRoutines()
                break;
        }
    }, [sideBarTab])

    useEffect(() => {
        getWorkspaces()
    }, [])

    const createWorkspace = async () => {
        const response = await post('workspace', {});

        if (response.ok) {
            const data = await response.json();
            console.log(data.workspace);
            setWorkspaces([...workspaces, data.workspace]);
        } else {
            console.error('Failed to fetch Workspace:', response.status);
        }
    }

    const setWorkspace = (workspace, folder = null) => {
        setActiveWorkspace(workspace);
        localStorage.setItem('workspace', JSON.stringify(workspace))

        let path = "/workspace/" + workspace.title.toLowerCase();

        if (folder !== null) {
            const fullPath = buildFolderPath(folder, workspace.folders || []);
            path += "/" + fullPath;
        }

        console.log(path);
        router.push(path);
    };


    function buildFolderPath(folder, allFolders) {
        const segments = [folder.title.toLowerCase()];
        let parentId = folder.workspace_folder_id;

        while (parentId) {
            const parent = allFolders.find(f => f.id === parentId);
            if (!parent) break;

            segments.unshift(parent.title.toLowerCase());
            parentId = parent.workspace_folder_id;
        }

        return segments.join("/");
    }

    const createFolder = async (workspace, type) => {
        let diff = 'folder'
        if (type === 1) diff = 'board'

        const response = await post(`workspace/${workspace.id}/${diff}`, {})
        
        if (response.ok) {
            const data = await response.json();
            const newFolder = data.folder;
    
            const updatedActiveWorkspace = {
                ...workspace,
                folders: [...(workspace.folders || []), newFolder]
            };
    
            const updatedWorkspaces = workspaces.map((ws) =>
                ws.id === workspace.id ? updatedActiveWorkspace : ws
            );
    
            if (workspace.id === activeWorkspace.id) 
                setActiveWorkspace(updatedActiveWorkspace);
            setWorkspaces(updatedWorkspaces);
        }
    }

    const renderFolders = (folders, workspace) => {
        return folders.map((folder) => (
            <div key={folder.id}>
                <div className="row" onClick={(ev) => {
                    ev.preventDefault();
                    setWorkspace(workspace, folder);
                }}>
                    <button className="sub">
                        {folder?.type === 0 ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                        </svg>
                        ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                        )}
                        {folder.title}
                    </button>

                    <aside>
                        <button>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>
                        </button>
                        <p>/</p>
                        <button>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                        </button>
                    </aside>
                </div>
                {folder.folders && folder.folders.length > 0 && (
                    <div className="subfolders">
                        {renderFolders(folder.folders, workspace)}
                    </div>
                )}
            </div>
        ));
    };


    return (
        <div id="dashboard">
            <aside className="side-box">
                <CalendarNavigation  />

                {sideBarTab === 'workspace' && 
                <div className="workspace-navigator">
                    <button id="add-workspace" onClick={() => {createWorkspace()}}>
                        Create Workspace
                    </button>

                    {workspaces.map((workspace) => (
                        <div className="workspace-row" key={workspace.id}>
                            <div className="row">
                                <button className="main" onClick={() => setWorkspace(workspace)}>
                                    {workspace.title}
                                </button>
                                <aside>
                                    <button>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>
                                    </button>
                                    <p>/</p>
                                    <button>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                                    </button>
                                </aside>
                            </div>

                            {(workspace.folders && activeWorkspace?.id === workspace.id) && renderFolders(workspace.folders, workspace)}
                        </div>
                    ))}

                </div>}

                {sideBarTab === 'routines' && 
                <div className="routine-navigator">
                    {routines.map(routine => <RoutineTracker key={routine.id} routine={routine} />)}
                </div>}
            </aside>

            <main>
                <div id="workspace">
                    <Navigation>
                        <button onClick={() => {createFolder(activeWorkspace, 0)}}>
                            add folder
                            <span></span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>
                        </button>
                        <button onClick={() => {createFolder(activeWorkspace, 1)}}>
                            add board
                            <span></span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                        </button>
                    </Navigation>

                    { children}
                </div>
            </main>
        </div>
    )
}

export default Layout;