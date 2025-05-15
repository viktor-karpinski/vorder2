"use client";

import KanbanBoard from "@/components/KanbanBoard";
import { useWorkspaceContext } from "@/context";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useApi } from "@/api";

const FolderPage = ({ params }) => {
    const { activeWorkspace } = useWorkspaceContext();
    const pathname = usePathname();

    const [activeFolder, setActiveFolder] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [columns, setColumns] = useState(null);
    const [displayBoard, setDisplayBoard] = useState(false);

    const { get, post } = useApi()

    useEffect(() => {
        if (!activeWorkspace) return;

        const segments = pathname.split("/").filter(Boolean);
        const lastSegment = segments[segments.length - 1];

        const matchedFolder = activeWorkspace.folders?.find(
            (folder) => folder.title.toLowerCase() === lastSegment.toLowerCase()
        );

        setActiveFolder(matchedFolder);

        getFolder(matchedFolder.id)
    }, [pathname, activeWorkspace]);

    useEffect(() => {
        if (!columns) return;

        const needsReorder = columns.some((col, index) => col.order !== index);
      
        if (needsReorder) {
          const payload = columns.map((col, index) => ({
            id: col.id,
            order: index,
          }));
      
          post(`workspace/board/${activeFolder.id}/reorder`, { columns: payload });
        }
    }, [columns])

    useEffect(() => {
        
    }, [tasks])

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
        return <KanbanBoard columns={columns} setColumns={setColumns} tasks={tasks} setTasks={setTasks} />;
    }

    return (
        <h1 style={{ color: "white" }}>
            Folder: {activeFolder?.title ?? "Unknown Folder"}
        </h1>
    );
};

export default FolderPage;