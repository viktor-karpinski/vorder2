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

    return (
        <>
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
        </>
      );
}

export default Workspace;