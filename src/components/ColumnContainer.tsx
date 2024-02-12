import { Column, Id, Task } from "../types";
import TrashIcon from "../icons/TrashIcon";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"
import { useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import TaskCard from "./TaskCard";
interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  createTask: (id: Id) => void
  deleteTask: (id: Id) => void
  updateTask: (id: Id, content: string) => void
  tasks: Task[];
}


function ColumnContainer({ column, deleteColumn, updateColumn, createTask, deleteTask, updateTask, tasks }: Props) {
  const [editMode, setEditMode] = useState(false);  //initially the edit mode is set to false

  const tasksId = useMemo(() => {
    return tasks.map(task => task.id)
  }, [tasks])

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,  //drag and drop disabled when edit mode is true
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  }

  if (isDragging)  //after the column is dragged,some styles to piche ka jagah
  {
    return <div className="bg-columnBackgroundColor w-[350px] opacity-60 border-2 border-rose-500 h-[500px] max-h-[500px] rounded-md flex flex-col" ref={setNodeRef} style={style} ></div>
  }

  return (
    <div ref={setNodeRef} style={style} className="bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col">
      {/* column title */}
      <div {...attributes}
        {...listeners}
        onClick={() => setEditMode(true)}
        className="bg-mainBackgroundColor text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-columnBackgroundColor border-4 flex items-center justify-between">
        <div className="flex gap-2">
          <div className="flex justify-center items-center bg-columnBackgroundColor  px-2 py-1 text-sm rounded-full">{tasks.length}</div>

          {!editMode && column.title}
          {editMode && <input className="bg-black focus:border-rose-500 border rounded outline-none px-2"
            value={column.title}
            onChange={(e) => updateColumn(column.id, e.target.value)}
            autoFocus onBlur={() => setEditMode(false)}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              setEditMode(false);
            }} />}
        </div>
        <button className="stroke-gray-500 hover:stroke-white hover:bg-columnBackgroundColor rounded px-1 py-2" onClick={() => {
          deleteColumn(column.id);
        }}><TrashIcon />
        </button>
      </div>



      {/* Column task container */}
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={tasksId}>
          {tasks.map((t) => (
            <TaskCard key={t.id} task={t} deleteTask={deleteTask} updateTask={updateTask} />
          ))}
        </SortableContext>
      </div>



      {/* Column footer */}
      <button className="flex gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor hover:bg-mainBackgroundColor hover:text-rose-500 active:bg-black"
        onClick={() => createTask(column.id)}
      ><PlusIcon />Add Task</button>
    </div>
  );
}

export default ColumnContainer;