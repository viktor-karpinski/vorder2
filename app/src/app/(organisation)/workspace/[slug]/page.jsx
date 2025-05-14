"use client"

import { useApi } from "@/api";
import KanbanBoard from "@/components/KanbanBoard";
import Folder from "@/components/Workspace/Folder";
import { useWorkspaceContext } from "@/context";
import Link from "next/link";

const Workspace = () => {
    const { get, post } = useApi();

    const { workspaces, setWorkspaces, activeWorkspace, setActiveWorkspace } = useWorkspaceContext();

    const createFolder = async () => {
        const response = await post(`workspace/${activeWorkspace.id}/folder`, {})
        
        if (response.ok) {
            const data = await response.json();
            const newFolder = data.folder;
    
            const updatedActiveWorkspace = {
                ...activeWorkspace,
                folders: [...(activeWorkspace.folders || []), newFolder]
            };
    
            const updatedWorkspaces = workspaces.map((ws) =>
                ws.id === activeWorkspace.id ? updatedActiveWorkspace : ws
            );
    
            setActiveWorkspace(updatedActiveWorkspace);
            setWorkspaces(updatedWorkspaces);
        }
    }

    //return (<KanbanBoard />)

    return (
        <div id="workspace">
            <header>
                <h1>
                    WS: <span>{activeWorkspace.title}</span>
                </h1>
                <div className="controls-wrapper">
                    <button onClick={() => {createFolder()}}>
                        add folder
                        <span></span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>
                    </button>
                    <button onClick={() => {createFolder()}}>
                        add board
                        <span></span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                    </button>
                </div>
            </header>

            <section className="workspace-container">
                <article className="folder-container">
                    <h2>
                        Folders: 
                    </h2>
                    {activeWorkspace?.folders?.map(folder => (
                        <Folder folder={folder} key={folder.id} />
                    ))}
                </article>
            </section>
        </div>
      );
}

export default Workspace;