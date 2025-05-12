"use client"

import { useMemo, useState } from "react";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext } from '@dnd-kit/sortable'
import KanbanColumn from "./KanbanColumn";

const KanbanBoard = () => {

    const [ columns, setColumns ] = useState([]);

    const [ activeColumn, setActiveColumn ] = useState({})

    const columnsId = useMemo(() => columns.map(column => column.id), [columns])

    const [ tasks, setTasks ] = useState([])

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 20,
            }
        })
    )

    const addColumn = () => {
        const newColumn = {
            id: Math.floor(Math.random()*1000),
            title: "column",
        }

        setColumns([...columns, newColumn])
    }

    const updateColumn = (id, title) => {
        const newColumns = columns.map(column => {
            if (column.id !== id) return column
            return {...column, title}
        })

        setColumns(newColumns)
    }

    const createTask = (columnId) => {
        const newTask = {
            id: Math.floor(Math.random()*1000),
            columnId,
            title: `Task: ${tasks.length + 1}`
        }

        console.log("wtf")

        setTasks([...tasks, newTask])
    }

    const onDragStart = (ev) => {
        if (ev.active.data.current.type === "Column") {
            setActiveColumn(ev.active.data.current.column)
            return
        } 
        setActiveColumn(null)
    }

    const onDragEnd = (ev) => {
        if (activeColumn !== null) {
            const { active, over } = ev

            if (!over) {
                return
            }
    
            const activeId = active.id
            const overId = over.id
    
            if (activeId === overId) {
                return
            }
    
            setColumns(columns => {
                const activeColumnIndex = columns.findIndex(column => column.id == activeId)
                const overColumnIndex = columns.findIndex(column => column.id == overId)
    
                return arrayMove(columns, activeColumnIndex, overColumnIndex)
            })
        }
    }

    return (
        <section id="kanban">
            <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
                <div className="columns-wrapper">
                    <SortableContext items={columnsId}>
                        {columns.map((column) => (
                            <KanbanColumn 
                                key={column.id} 
                                column={column} 
                                updateColumn={updateColumn} 
                                createTask={createTask} 
                                tasks={tasks.filter(task => task.columnId === column.id)}
                            />
                        ))}
                    </SortableContext>

                    <DragOverlay>
                        {activeColumn && (
                            <KanbanColumn 
                                key={activeColumn.id} 
                                column={activeColumn} 
                                updateColumn={updateColumn} 
                                createTask={createTask} 
                                tasks={tasks.filter(task => task.columnId === activeColumn.id)}
                            />
                        )}
                    </DragOverlay>

                    <article className="column">
                        <button id="add-button" onClick={addColumn}>
                            <span>
                                +
                            </span>
                            add column
                        </button>
                    </article>
                </div>
            </DndContext>
        </section>
    )
}

export default KanbanBoard;