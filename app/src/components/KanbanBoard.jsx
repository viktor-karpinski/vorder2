"use client"

import { useMemo, useState } from "react";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext } from '@dnd-kit/sortable'
import KanbanColumn from "./KanbanColumn";

const KanbanBoard = () => {

    const [ columns, setColumns ] = useState([]);

    const [ activeColumn, setActiveColumn ] = useState({})

    const columnsId = useMemo(() => columns.map(column => column.id), [columns])

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

    const onDragStart = (ev) => {
        if (ev.active.data.current.type === "Column") {
            console.log('here')
            setActiveColumn(ev.active.data.current.column)
            return
        }
    }

    const onDragEnd = (ev) => {
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

    return (
        <section id="kanban">
            <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
                <div className="columns-wrapper">
                    <SortableContext items={columnsId}>

                    {columns.map((column) => (
                        <KanbanColumn key={column.id} column={column} updateColumn={updateColumn} />
                    ))}

                    </SortableContext>

                    <article className="column">
                        <button id="add-button" onClick={addColumn}>
                            <span>
                                +
                            </span>
                            add column
                        </button>
                    </article>

                    <DragOverlay>
                    {activeColumn && (
                        <KanbanColumn key={activeColumn.id} column={activeColumn} updateColumn={updateColumn} />
                    )}
                </DragOverlay>
                </div>
            </DndContext>
        </section>
    )
}

export default KanbanBoard;