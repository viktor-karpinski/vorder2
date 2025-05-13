"use client"

import { useApi } from "@/api";
import CalendarNavigation from "@/components/CalendarNavigation";
import { useWorkspaceContext } from "@/context";
import { useEffect } from "react";
import { useRouter } from 'next/navigation';

const Layout = ({children}) => {
    const { get, post } = useApi();
    const { workspaces, setWorkspaces, setActiveWorkspace } = useWorkspaceContext();

    const router = useRouter();

    const getWorkspaces = async () => {
        const response = await get('workspaces');

        if (response.ok) {
            const data = await response.json();
            console.log(data.workspaces);
            setWorkspaces(data.workspaces);
        } else {
            console.error('Failed to fetch Workspaces:', response.status);
        }
    }

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

    const setWorkspace = (workspace) => {
        setActiveWorkspace(workspace);
        router.push(`/workspace/${workspace.title.toLowerCase()}`);
    }

    return (
        <div id="dashboard">
            <aside className="side-box">
                <CalendarNavigation  />

                <div className="workspace-navigator">
                    <button id="add-workspace" onClick={() => {createWorkspace()}}>
                        Create Workspace
                    </button>

                    {workspaces.map(workspace => (
                        <div className="workspace-row" key={workspace.id} onClick={() => {setWorkspace(workspace)}}>
                            <button className="main">
                                {workspace.title}
                            </button>
                            {workspace.folders?.map(folder => (
                                <button key={folder.id} className="folder">
                                    -&gt; {folder.title}
                                </button>
                            ))}
                        </div>
                    ))}
                </div>
            </aside>

            <main>
                { children}
            </main>
        </div>
    )
}

export default Layout;