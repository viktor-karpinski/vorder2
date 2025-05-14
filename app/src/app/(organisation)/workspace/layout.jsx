"use client"

import { useApi } from "@/api";
import CalendarNavigation from "@/components/CalendarNavigation";
import { useWorkspaceContext } from "@/context";
import { useEffect } from "react";
import { useRouter } from 'next/navigation';
import Navigation from "@/components/Navigation";

const Layout = ({params, children}) => {
    const { get, post } = useApi();
    const { workspaces, setWorkspaces, setActiveWorkspace, activeWorkspace } = useWorkspaceContext();

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
                            <div className="row">
                                <button className="main">
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
                            {workspace.folders?.map(folder => (
                                <div key={folder.id} className="row">
                                    <button className="sub">
                                        -&gt; {folder.title}
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
                            ))}
                        </div>
                    ))}
                </div>
            </aside>

            <main>
                <div id="workspace">
                    <Navigation>
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
                    </Navigation>

                    { children}
                </div>
            </main>
        </div>
    )
}

export default Layout;