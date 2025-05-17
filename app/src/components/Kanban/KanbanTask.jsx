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
        transform: CSS.Translate.toString(transform),
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
            <button className="trash" onClick={() => {removeTask(task.id)}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
        </div>
    );
};

export default KanbanTask;