// KanbanBoard.jsx
"use client";

import { useMemo, useState } from "react";
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
    closestCorners,
    defaultDropAnimation,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
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

    const onDragOver = ({ active, over }) => {
        const type = active.data.current?.type;
        if (type !== "task" || !over) return;

        const activeId = active.id;
        const overId = over.id;

        const activeTaskData = active.data.current.task;
        const overColumn = columns.find((col) => col.id === overId);
        const overTask = tasks.find((task) => task.id === overId);

        let newColumnId = overTask ? overTask.columnId : overColumn?.id;
        if (!newColumnId || activeTaskData.columnId === newColumnId) return;

        setTasks((prev) =>
            prev.map((task) =>
                task.id === activeId ? { ...task, columnId: newColumnId } : task
            )
        );
    };

    const onDragEnd = ({ active, over }) => {
        setActiveTask(null);
        setActiveColumn(null);

        const type = active.data.current?.type;

        if (type === "column") {
          const oldIndex = columns.findIndex((c) => c.id === active.id);
          const newIndex = columns.findIndex((c) => c.id === over.id);
          if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
              setColumns((prev) => arrayMove(prev, oldIndex, newIndex));
          }
          return;
      }

        if (!over || type !== "task") return;

        const activeId = active.id;
        const overId = over.id;

        const activeTaskData = active.data.current.task;
        const overTask = tasks.find((t) => t.id === overId);
        const columnId = overTask?.columnId || activeTaskData.columnId;

        const columnTasks = tasks.filter((t) => t.columnId === columnId);
        const oldIndex = columnTasks.findIndex((t) => t.id === activeId);
        const newIndex = columnTasks.findIndex((t) => t.id === overId);

        if (oldIndex !== -1 && newIndex !== -1) {
            const updated = arrayMove(columnTasks, oldIndex, newIndex);
            const otherTasks = tasks.filter((t) => t.columnId !== columnId);
            setTasks([...otherTasks, ...updated]);
        }
    };

    return (
        <section id="kanban">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
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

                    <DragOverlay dropAnimation={defaultDropAnimation}>
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
