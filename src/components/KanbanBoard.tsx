import PlusIcon from "../icons/PlusIcon";
import { useMemo, useState } from "react";
import { Column, Id, Task } from "../types";
import ColumnContainer from "./ColumnContainer";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";


const defaultCols: Column[] = [
    {
        id: "todo",
        title: "Todo",
    },
    {
        id: "doing",
        title: "Work in progress",
    },
    {
        id: "done",
        title: "Done",
    },
];

const defaultTasks: Task[] = [
    {
        id: "1",
        columnId: "todo",
        content: "List admin APIs for dashboard",
    },
    {
        id: "2",
        columnId: "todo",
        content:
            "Develop user registration functionality with OTP delivered on SMS after email confirmation and phone number confirmation",
    },
    {
        id: "3",
        columnId: "doing",
        content: "Conduct security testing",
    },
    {
        id: "4",
        columnId: "doing",
        content: "Analyze competitors",
    },
    {
        id: "5",
        columnId: "done",
        content: "Create UI kit documentation",
    },
    {
        id: "6",
        columnId: "done",
        content: "Dev meeting",
    },
    {
        id: "7",
        columnId: "done",
        content: "Deliver dashboard prototype",
    },
    {
        id: "8",
        columnId: "todo",
        content: "Optimize application performance",
    },
    {
        id: "9",
        columnId: "todo",
        content: "Implement data validation",
    },
    {
        id: "10",
        columnId: "todo",
        content: "Design database schema",
    },
    {
        id: "11",
        columnId: "todo",
        content: "Integrate SSL web certificates into workflow",
    },
    {
        id: "12",
        columnId: "doing",
        content: "Implement error logging and monitoring",
    },
    {
        id: "13",
        columnId: "doing",
        content: "Design and implement responsive UI",
    },
];

function KanbanBoard() {
    const [columns, setColumns] = useState<Column[]>(defaultCols);
    const [tasks, setTasks] = useState<Task[]>(defaultTasks);
    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

    //for delete icon to not be part of drag
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        })
    );

    return (
        <div
            className=" m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]"
        >
            <DndContext
                sensors={sensors}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onDragOver={onDragOver}
            >
                <div className="m-auto flex gap-4">
                    <div className="flex gap-4">
                        <SortableContext items={columnsId}>
                            {columns.map((col) => (
                                <ColumnContainer
                                    key={col.id}
                                    column={col}
                                    deleteColumn={deleteColumn}
                                    updateColumn={updateColumn}
                                    createTask={createTask}
                                    deleteTask={deleteTask}
                                    updateTask={updateTask}
                                    tasks={tasks.filter((task) => task.columnId === col.id)}
                                />
                            ))}
                        </SortableContext>
                    </div>
                    <button
                        onClick={() => {
                            createNewColumn();
                        }}
                        className=" h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 ring-rose-500 hover:ring-2 flex gap-2"
                    >
                        <PlusIcon />
                        Add Column
                    </button>
                </div>
                {createPortal(
                    <DragOverlay >
                        {activeColumn && <ColumnContainer column={activeColumn} deleteColumn={deleteColumn} createTask={createTask} updateColumn={updateColumn} deleteTask={deleteTask} tasks={tasks.filter((task) => task.columnId === activeColumn.id)}
                            updateTask={updateTask} />}
                        {
                            activeTask && <TaskCard task={activeTask} deleteTask={deleteTask} updateTask={updateTask} />
                        }
                    </DragOverlay>, document.body
                )}
            </DndContext>
        </div>
    );



    function createNewColumn() {
        const columnToAdd: Column = {
            id: generateId(),
            title: `Column ${columns.length + 1}`,
        };

        setColumns([...columns, columnToAdd]);
    }

    function createTask(columnId: Id) {
        const newTask: Task = {
            id: generateId(),
            columnId,
            content: `Task ${tasks.length + 1}`
        }
        setTasks([...tasks, newTask]);
    }

    function deleteColumn(id: Id) {
        const filteredColumns = columns.filter((col) => col.id !== id);
        setColumns(filteredColumns);

        const newTasks = tasks.filter((t) => t.columnId !== id);
        setTasks(newTasks);
    }

    function updateColumn(id: Id, title: string) {
        const newColumns = columns.map(col => {
            if (col.id !== id) return col;
            return { ...col, title };
        })

        setColumns(newColumns)
    }

    function updateTask(id: Id, content: string) {
        const newTasks = tasks.map(task => {
            if (task.id !== id) return task;
            return { ...task, content }
        })
        setTasks(newTasks)
    }


    function onDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === "Column") {
            setActiveColumn(event.active.data.current.column);
            return;
        }

        if (event.active.data.current?.type === 'Task') {
            setActiveTask(event.active.data.current.task)
            return;
        }
    }

    function onDragEnd(event: DragEndEvent) {
        setActiveColumn(null)
        setActiveTask(null)
        const { active, over } = event;
        if (!over) return;  //still dragging is not end

        const activeColumnId = active.id;
        const overColumnId = over.id

        //drag intial and drag final poisition same\
        //means no drag
        if (activeColumnId === overColumnId) return;

        //swapping elements
        setColumns(columns => {
            const activeColumnIndex = columns.findIndex(col => col.id === activeColumnId)

            const overColumnIndex = columns.findIndex(col => col.id === overColumnId)


            //swapping the active and over column array's array inside the columns array and returning new array
            return arrayMove(columns, activeColumnIndex, overColumnIndex);
        })

    }

    function onDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;  //still dragging is not end

        const activeId = active.id;
        const overId = over.id

        //drag intial and drag final poisition same
        //means no drag
        if (activeId === overId) return;


        //checking first if they are tasks id or column id
        const isActiveTask = active.data.current?.type === 'Task'
        const isOverTask = active.data.current?.type === 'Task'

        if (!isActiveTask) return;

        //dropping task over another task
        if (isActiveTask && isOverTask) //swap tasks
        {
            setTasks(tasks => {
                const activeIndex = tasks.findIndex(task => task.id === activeId)

                const overIndex = tasks.findIndex(task => task.id === overId)

                //dono alag alag columns ke hai
                tasks[activeIndex].columnId = tasks[overIndex].columnId;

                return arrayMove(tasks, activeIndex, overIndex);
            })
        }

        //dropping task over a column
        // Im dropping a Task over a column
        const isOverAColumn = over.data.current?.type === "Column";
        if (isActiveTask && isOverAColumn) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);

                tasks[activeIndex].columnId = overId;
                console.log("DROPPING TASK OVER COLUMN", { activeIndex });
                return arrayMove(tasks, activeIndex, activeIndex);
            });
        }
    }
    function deleteTask(id: Id) {
        const newTasks = tasks.filter((task) => task.id !== id)
        setTasks(newTasks)
    }
}



function generateId() {
    /* Generate a random number between 0 and 10000 */
    return Math.floor(Math.random() * 10001);
}

export default KanbanBoard;