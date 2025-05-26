"use client";

import KanbanBoard from "@/components/Kanban/KanbanBoard";
import { useWorkspaceContext } from "@/context";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useApi } from "@/api";
import Navigation from "@/components/Navigation";

const FolderPage = ({ params }) => {
    const { activeWorkspace } = useWorkspaceContext();
    const pathname = usePathname();

    const [activeFolder, setActiveFolder] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [columns, setColumns] = useState(null);
    const [displayBoard, setDisplayBoard] = useState(false);

    const { get, post } = useApi()

    function findFolderByPath(folders, pathSegments) {
        let current = null;

        for (const segment of pathSegments) {
            const lowerSegment = segment.toLowerCase();
            const match = (current ? current.folders : folders)?.find(
                (f) => f.title.toLowerCase() === lowerSegment
            );

            if (!match) return null;
            current = match;
        }

        return current;
    }

    useEffect(() => {
        if (!activeWorkspace) return;

        const segments = pathname.split("/").filter(Boolean);
        const folderSegments = segments.slice(3);

        const matchedFolder = findFolderByPath(activeWorkspace.folders, folderSegments);

        if (matchedFolder) {
            setActiveFolder(matchedFolder);
            getFolder(matchedFolder.id);
        }
    }, [pathname, activeWorkspace]);

    useEffect(() => {
        if (!columns) return;

        const needsReorder = columns.some((col, index) => col.order !== index);
      
        if (needsReorder) {
          const payload = columns.map((col, index) => ({
            id: col.id,
            order: index,
          }));

          console.log(JSON.stringify( { columns: payload }))
      
          post(`workspace/board/${activeFolder.id}/reorder`, { columns: payload });
        }
    }, [columns])

    const getFolder = async (id) => {
        const response = await get(`workspace/folder/${id}`)

        if (response.ok) {
            const data = await response.json()
            console.log(data.folder)

            if (data.folder.type === 1) {
                setDisplayBoard(true);
                setColumns(data.folder.columns)
            } else {
                setDisplayBoard(false);
            }

            setActiveFolder(data.folder)
            setTasks(data.todos)
        }
    }

    if (!activeWorkspace) return null;

    if (displayBoard && activeFolder !==  null && columns !== null) {
        return (
            <>
                <Navigation />
                <KanbanBoard columns={columns} setColumns={setColumns} tasks={tasks} setTasks={setTasks} />;
            </>
        )
    }

    return (
        <>
            <Navigation />
             <h1 style={{ color: "white" }}>
                Folder: {activeFolder?.title ?? "Unknown Folder"}
            </h1>
        </>
    );
};

export default FolderPage;