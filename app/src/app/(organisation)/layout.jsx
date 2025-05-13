"use client"

import { WorkspaceContextProvider } from "@/context";

const WorkspaceLayout = ({ children }) => {

    return (
        <WorkspaceContextProvider>
            {children}
        </WorkspaceContextProvider>
    );
}

export default WorkspaceLayout;