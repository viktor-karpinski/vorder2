"use client";

import { useMemo, useState } from "react";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import KanbanTask from "./KanbanTask";

const KanbanColumn = ({ column, tasks, updateColumn, createTask }) => {
    const [editMode, setEditMode] = useState(false);

    const taskIds = useMemo(() => tasks.map(task => task.id), [tasks]);

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: column.id,
        data: {
            type: "column",
            column,
        },
        disabled: editMode,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="column">
            <div className="heading-box" {...attributes} {...listeners}>
                {!editMode ? (
                    <p onClick={() => setEditMode(true)}>{column.title}</p>
                ) : (
                    <input
                        autoFocus
                        value={column.title}
                        onChange={(e) => updateColumn(column.id, e.target.value)}
                        onBlur={() => setEditMode(false)}
                        onKeyDown={(e) => e.key === "Enter" && setEditMode(false)}
                    />
                )}
            </div>

            <div className="content-box">
                <SortableContext items={taskIds}>
                    {tasks.map((task) => (
                        <KanbanTask key={task.id} task={task} />
                    ))}
                </SortableContext>
            </div>

            <button className="add-task" onClick={() => createTask(column.id)}>
                add task
            </button>
        </div>
    );
};

export default KanbanColumn;