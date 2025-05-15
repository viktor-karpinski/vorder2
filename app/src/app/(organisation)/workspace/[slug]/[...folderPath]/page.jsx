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
  const [columns, setColumns] = useState(null);
  const [displayBoard, setDisplayBoard] = useState(false);

  const { get } = useApi()

  useEffect(() => {
    if (!activeWorkspace) return;

    const segments = pathname.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1];

    const matchedFolder = activeWorkspace.folders?.find(
        (folder) => folder.title.toLowerCase() === lastSegment.toLowerCase()
    );

    setActiveFolder(matchedFolder);

    if (matchedFolder?.type === 1) {
        setDisplayBoard(true);
        getBoard(matchedFolder.id)
    } else {
        setDisplayBoard(false);
        }
    }, [pathname, activeWorkspace]);

    const getBoard = async (id) => {
        const response = await get(`board/${id}`)

        if (response.ok) {
            const data = await response.json()
            console.log(data.board)
            setColumns(data.board.columns)
            setActiveFolder(data.board)
        }
    }

    if (!activeWorkspace) return null;

    if (displayBoard && activeFolder !==  null && columns !== null) {
        return <KanbanBoard columns={columns} setColumns={setColumns} />;
    }

    return (
        <h1 style={{ color: "white" }}>
            Folder: {activeFolder?.title ?? "Unknown Folder"}
        </h1>
    );
};

export default FolderPage;
