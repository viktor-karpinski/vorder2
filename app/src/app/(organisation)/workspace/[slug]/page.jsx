"use client"

import { useApi } from "@/api";
import KanbanBoard from "@/components/KanbanBoard";
import Folder from "@/components/Workspace/Folder";
import { useWorkspaceContext } from "@/context";
import { useEffect, useState } from "react";

const Workspace = () => {
    const { get, post } = useApi();

    const { workspaces, setWorkspaces, activeWorkspace, setActiveWorkspace } = useWorkspaceContext();

    const [ loading, setLoading ] = useState(false)

    useEffect(() => {
        if (activeWorkspace === null) {
            setLoading(true)
        } else {
            setLoading(false)
        }
    }, [activeWorkspace])

    if (loading) {
        return (<><h2>loading</h2></>)
    }

    return (
        <>
            <section className="workspace-container">
                <article className="folder-container">
                    <h2>
                        Folders: 
                    </h2>
                    {activeWorkspace?.folders?.map(folder => (
                        folder.type === 0 && <Folder folder={folder} key={folder.id} />
                    ))}
                </article>
            </section>
        </>
      );
}

export default Workspace;