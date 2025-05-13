"use client"

import { useApi } from "@/api";
import { useWorkspaceContext } from "@/context";

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
        <section id="workspace">
          <h2>Workspace: {activeWorkspace.title}</h2>

          <button onClick={() => {createFolder()}}>
            add folder
          </button>
        </section>
      );
}

export default Workspace;