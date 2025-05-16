// Adjusted KanbanBoard.jsx to handle empty column drop correctly
"use client";

import { useMemo, useState } from "react";
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
    defaultDropAnimation,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    rectSortingStrategy,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import KanbanColumn from "./KanbanColumn";
import KanbanTask from "./KanbanTask";

import { pointerWithin } from "@dnd-kit/core";
import { useApi } from "@/api";
import TaskEdit from "../Workspace/TaskEdit";

const KanbanBoard = ({ columns, setColumns, tasks, setTasks }) => {
    //const [columns, setColumns] = useState(initialColumns || []);

    const [activeColumn, setActiveColumn] = useState(null);
    const [activeTask, setActiveTask] = useState(null);

    const { post } = useApi();

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

    const createTask = async (columnId) => {
        const template = {
            title: "",
            id: -1,
            columnId
        }

        setTasks((prev) => [...prev, template]);
    };

    const saveTask = async (tempTask, title) => {
    const response = await post(`workspace/board/${tempTask.columnId}/todo`, {
        title: title
    });

    if (response.ok) {
        const data = await response.json();

        setTasks(prev => {
            const updated = prev.map(t =>
                t.id === tempTask.id ? data.todo : t
            );

            const columnTasks = updated
                .filter(t => t.columnId === data.todo.columnId)
                .sort((a, b) => a.order - b.order)
                .map((t, index) => ({ ...t, order: index }));

            const others = updated.filter(t => t.columnId !== data.todo.columnId);

            const final = [...others, ...columnTasks];

            postTaskReorder(final);

            return final;
        });
    }
};

    
    const removeTask = (tempTaskId) => {
        setTasks(prev => prev.filter(t => t.id !== tempTaskId));
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
        const overTask = tasks.find((task) => task.id === overId);
        const overColumn = columns.find((col) => col.id === overId);

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
    if (!over || !type) return;

    if (type === "column") {
        const oldIndex = columns.findIndex((c) => c.id === active.id);
        const newIndex = columns.findIndex((c) => c.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
            setColumns((prev) => arrayMove(prev, oldIndex, newIndex));
        }
        return;
    }

    if (type === "task") {
        const activeId = active.id;
        const overId = over.id;
        const activeTaskData = active.data.current.task;

        const overTask = tasks.find((t) => t.id === overId);
        const overColumn = columns.find((c) => c.id === overId);

        const newColumnId = overTask?.columnId || overColumn?.id;
        if (!newColumnId) return;

        // 🧠 1. Switch columns only
        if (!overTask && overColumn) {
            const updated = tasks.map((task) =>
                task.id === activeId ? { ...task, columnId: newColumnId } : task
            );

            setTasks(updated);
            postTaskReorder(updated);
            return;
        }

        // 🧠 2. Within same column — reorder logic
        const columnTasks = tasks.filter((t) => t.columnId === newColumnId);
        const oldIndex = columnTasks.findIndex((t) => t.id === activeId);
        const newIndex = columnTasks.findIndex((t) => t.id === overId);

        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
            const updated = arrayMove(columnTasks, oldIndex, newIndex).map((t, i) => ({
                ...t,
                order: i,
                columnId: newColumnId,
            }));

            const others = tasks.filter((t) => t.columnId !== newColumnId);
            const final = [...others, ...updated];

            setTasks(final);
            postTaskReorder(final);
        }
    }
};


    const postTaskReorder = (tasks) => {
        const payload = tasks.map((task) => ({
            id: task.id,
            column_id: task.columnId,
            order: task.order,
        }));

        post(`workspace/board/reorder-tasks`, { tasks: payload });
    };


    const taskClicked = (task) => {
        console.log('okok', task)
    }

    return (
      <section id="kanban">
        <DndContext
            sensors={sensors}
            collisionDetection={pointerWithin}
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
                            taskClicked={taskClicked}
                            saveTask={saveTask}
                            removeTask={removeTask}
                        />
                    ))}
                </SortableContext>

                <DragOverlay dropAnimation={defaultDropAnimation}>
                    {activeColumn ? (
                        <KanbanColumn
                            column={activeColumn}
                            updateColumn={updateColumn}
                            createTask={createTask}
                            tasks={tasks.filter((t) => t.columnId === activeColumn.id)}
                            taskClicked={taskClicked}
                            saveTask={saveTask}
                            removeTask={removeTask}
                        />
                    ) : activeTask ? (
                        <KanbanTask task={activeTask} taskClicked={taskClicked} />
                    ) : null}
                </DragOverlay>
            </div>
        </DndContext>
      </section>
    );
};

export default KanbanBoard;
