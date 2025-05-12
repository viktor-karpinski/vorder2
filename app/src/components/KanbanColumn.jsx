"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useState } from "react"

const KanbanColumn = ({column, updateColumn, createTask, tasks}) => {

    const [ editMode, setEditMode ] = useState(false);

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column
        },
        disabled: editMode
    })

    const style = {
        transition, 
        transform: CSS.Transform.toString(transform),
    }

    if (isDragging) {
        return ( <article ref={setNodeRef} style={style} className="column dragging"></article>)
    }

    return (
        <article ref={setNodeRef} style={style} className="column">
            <div className="container">
                <div className="heading-box" {...attributes} {...listeners}>
                    {!editMode && (<p onClick={() => {setEditMode(true)}}>
                        {column.title}
                    </p>)}
                    {editMode && (
                        <input 
                            type="text" 
                            autoFocus 
                            onBlur={() => {setEditMode(false)}} 
                            onKeyDown={(ev) => {
                                if (ev.key !== "Enter") return
                                setEditMode(false)
                            }}
                            value={column.title} 
                            onChange={(ev) => updateColumn(column.id, ev.target.value)}
                        />
                    )}
                </div>

                <div className="content-box">
                    {tasks.map(task => (
                        <div className="task" key={task.id}>
                            <p>{task.title}</p>
                        </div>
                    ))}
                </div>

                <button className="add-task" onClick={() => {createTask(column.id)}}>
                    add task
                </button>
            </div>
        </article>
    )
}

export default KanbanColumn;