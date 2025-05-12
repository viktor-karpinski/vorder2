"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const KanbanTask = ({ task }) => {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: "task",
            task,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        border: task.placeholder ? "2px dashed #aaa" : undefined,
        backgroundColor: task.placeholder ? "transparent" : "var(--background)",
        height: task.placeholder ? "5rem" : undefined,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="task"
        >
            {!task.placeholder && <p>{task.title}</p>}
        </div>
    );
};

export default KanbanTask;
