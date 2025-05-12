"use client";

import { useMemo, useState } from "react";
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
    closestCorners,
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    rectSortingStrategy,
} from "@dnd-kit/sortable";
import KanbanColumn from "./KanbanColumn";
import KanbanTask from "./KanbanTask";

const KanbanBoard = () => {
    const [columns, setColumns] = useState([]);
    const [tasks, setTasks] = useState([]);

    const [activeColumn, setActiveColumn] = useState(null);
    const [activeTask, setActiveTask] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        })
    );

    const columnIds = useMemo(() => columns.map((col) => col.id), [columns]);

    const addColumn = () => {
        const newColumn = {
            id: crypto.randomUUID(),
            title: "New Column",
        };
        setColumns((prev) => [...prev, newColumn]);
    };

    const updateColumn = (id, title) => {
        setColumns((prev) =>
            prev.map((col) => (col.id === id ? { ...col, title } : col))
        );
    };

    const createTask = (columnId) => {
        const newTask = {
            id: crypto.randomUUID(),
            title: `Task ${tasks.length + 1}`,
            columnId,
        };
        setTasks((prev) => [...prev, newTask]);
    };

    const onDragStart = (event) => {
        const { active } = event;
        const type = active.data.current?.type;

        if (type === "column") {
            setActiveColumn(active.data.current.column);
        }

        if (type === "task") {
            setActiveTask(active.data.current.task);
        }
    };

    const onDragEnd = (event) => {
        const { active, over } = event;

        if (!over) return;

        const type = active.data.current?.type;

        if (type === "column") {
            const oldIndex = columns.findIndex((c) => c.id === active.id);
            const newIndex = columns.findIndex((c) => c.id === over.id);
            if (oldIndex !== -1 && newIndex !== -1) {
                setColumns((prev) => arrayMove(prev, oldIndex, newIndex));
            }
        }

        if (type === "task") {
            const activeTaskData = active.data.current.task;
            const overId = over.id;

            const overTask = tasks.find((t) => t.id === overId);
            const overColumn = columns.find((c) => c.id === overId);

            if (!overTask && !overColumn) return;

            let newColumnId = overTask ? overTask.columnId : overColumn?.id;

            if (!newColumnId) return;

            const updatedTasks = tasks.map((task) => {
                if (task.id === active.id) {
                    return { ...task, columnId: newColumnId };
                }
                return task;
            });

            setTasks(updatedTasks);
        }

        setActiveColumn(null);
        setActiveTask(null);
    };

    return (
        <section id="kanban">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
            >
                <div className="columns-wrapper">
                    <SortableContext items={columnIds} strategy={rectSortingStrategy}>
                        {columns.map((column) => (
                            <KanbanColumn
                                key={column.id}
                                column={column}
                                updateColumn={updateColumn}
                                createTask={createTask}
                                tasks={tasks.filter((t) => t.columnId === column.id)}
                            />
                        ))}
                    </SortableContext>

                    <article className="column">
                        <button id="add-button" onClick={addColumn}>
                            <span>+</span> add column
                        </button>
                    </article>

                    <DragOverlay>
                        {activeColumn ? (
                            <KanbanColumn
                                column={activeColumn}
                                updateColumn={updateColumn}
                                createTask={createTask}
                                tasks={tasks.filter((t) => t.columnId === activeColumn.id)}
                            />
                        ) : activeTask ? (
                            <KanbanTask task={activeTask} />
                        ) : null}
                    </DragOverlay>
                </div>
            </DndContext>
        </section>
    );
};

export default KanbanBoard;
