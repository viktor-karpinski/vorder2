"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

const KanbanTask = ({ task, taskClicked, saveTask, removeTask }) => {
    const [title, setTitle] = useState("");

    const checkTitle = async () => {
        if (title.trim() === "") {
            if (task.id === -1) {
                removeTask(task.id);
            }
        } else {
            if (task.id === -1) {
                await saveTask(task, title);
            } else {
                // Could also be edit logic here
            }
        }
    };

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
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="task"
            onClick={() => {taskClicked(task)}}
        >
            {(task.id !== -1) && (<p>{task.title}</p>)}
            {task.id === -1 && 
            <textarea 
                autoFocus
                ref={(ref) => {
                    if (ref) {
                        ref.style.height = "3rem";
                        ref.style.height = `${ref.scrollHeight}px`;
                    }
                }}
                value={title} 
                onChange={(ev) => {setTitle(ev.target.value)}}
                onBlur={() => checkTitle()}
                onKeyDown={(e) => e.key === "Enter" && checkTitle()}
            >
            </textarea>}
        </div>
    );
};

export default KanbanTask;