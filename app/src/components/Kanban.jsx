"use client"

import { useState } from "react";
import { DndContext } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'

const Kanban = () => {

    const [ columns, setColumns ] = useState([]);

    const addColumn = () => {
        const newColumn = {
            id: Math.floor(Math.random()*1000),
            title: "column",
        }

        setColumns([...columns, newColumn])

        console.log('hehe')
    }

    const onDragStart = (ev) => {

    }

    return (
        <section id="kanban">
            <DndContext>
                <div className="columns-wrapper">
                    <SortableContext>
                    {columns.map((column) => (
                        <article className="column"  key={column.id}>
                            <div className="heading-box">
                                <p>
                                    {column.title}
                                </p>
                            </div>
                        </article>
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
                </div>
            </DndContext>
        </section>
    )
}

export default Kanban;