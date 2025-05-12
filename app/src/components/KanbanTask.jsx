"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

const KanbanTask = ({task}) => {

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: task.id,
        data: {
            type: "Task",
            task
        },
    })

    const style = {
        transition, 
        transform: CSS.Transform.toString(transform),
    }

    if (isDragging) {
        return (<div className="task dragging"><p>{task.title}</p></div>)
    }

    return (
        <div ref={setNodeRef} style={style} className="task" {...attributes} {...listeners}>
            <p>{task.title}</p>
        </div>
    )
}

export default KanbanTask;