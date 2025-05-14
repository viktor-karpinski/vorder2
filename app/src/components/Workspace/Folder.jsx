"use client";

import { useApi } from "@/api";
import Link from "next/link";
import { useState } from "react";
import { useWorkspaceContext } from "@/context";

const Folder = ({ folder }) => {
    const { post } = useApi();
    const { activeWorkspace, setActiveWorkspace, workspaces, setWorkspaces } = useWorkspaceContext();

    const [editMode, setEditMode] = useState(false);
    const [title, setTitle] = useState(folder.title);

    const updateTitle = async (id, newTitle) => {
        const response = await post(`folder/${id}/title`, { title: newTitle });

        if (response.ok) {
            // Update activeWorkspace
            const updatedFolders = activeWorkspace.folders.map(f =>
                f.id === id ? { ...f, title: newTitle } : f
            );
            const updatedActiveWorkspace = {
                ...activeWorkspace,
                folders: updatedFolders,
            };
            setActiveWorkspace(updatedActiveWorkspace);

            // Update workspaces
            const updatedWorkspaces = workspaces.map(ws =>
                ws.id === activeWorkspace.id ? updatedActiveWorkspace : ws
            );
            setWorkspaces(updatedWorkspaces);
        }
    };

    return (
        <Link className="folder" key={folder.id} href="/">
            <div className="title-wrapper">
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

                {!editMode ? (
                    <h3
                        onClick={(e) => {
                            e.preventDefault();
                            setEditMode(true);
                        }}
                    >
                        {folder.title}
                    </h3>
                ) : (
                    <input
                        autoFocus
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={() => setEditMode(false)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                setEditMode(false);
                                if (title !== folder.title) updateTitle(folder.id, title);
                            }
                        }}
                    />
                )}
            </div>
        </Link>
    );
};

export default Folder;
