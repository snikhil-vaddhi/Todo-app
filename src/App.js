import { useState } from "react";

const initialItems = [
  {
    id: 12345,
    text: "Build a todo app",
    taskComplete: true,
    taskUpdate: false,
  },
  {
    id: 67890,
    text: "Learn JavaScript",
    taskComplete: false,
    taskUpdate: false,
  },
  {
    id: 23452,
    text: "Write article about todo",
    taskComplete: false,
    taskUpdate: false,
  },
  {
    id: 78906,
    text: "Publish the article",
    taskComplete: false,
    taskUpdate: false,
  },
];

export default function App() {
  const [addTasks, setAddTasks] = useState(initialItems);
  // const [editTask, setEditTask] = useState("");
  const [text, setText] = useState("");
  const taskComplete = false;
  const taskUpdate = false;
  const [editId, setEditId] = useState(null);

  function handleAddTasks(newTask) {
    setAddTasks((tasks) => [...tasks, newTask]);
  }

  function handleTaskComplete(task) {
    setAddTasks((addTasks) =>
      addTasks.map((t) =>
        t.id === task.id ? { ...t, taskComplete: !t.taskComplete } : t
      )
    );
  }
  function handleDelete(task) {
    setAddTasks((addTasks) => addTasks.filter((t) => t.id !== task.id));
  }
  function handleEditTask(task) {
    setText(task.text);
    setAddTasks((addTasks) =>
      addTasks.map((t) => {
        if (t.id === task.id) {
          setEditId(t.id);

          return { ...t, taskUpdate: !t.taskUpdate };
        } else {
          return t;
        }
      })
    );
  }

  return (
    <div className="all">
      <Header />
      <TaskTracker addTasks={addTasks} />
      <TaskBar
        onAddTask={handleAddTasks}
        addTasks={addTasks}
        taskComplete={taskComplete}
        text={text}
        setText={setText}
        taskUpdate={taskUpdate}
        editId={editId}
        setAddTasks={setAddTasks}
        setEditId={setEditId}
      />
      {/* <TaskList
        addTasks={addTasks}
        // sortedList={sorted}
        // taskComplete={taskComplete}
        handleTaskComplete={handleTaskComplete}
        handleDelete={handleDelete}
        handleEditTask={handleEditTask}
      /> */}
      <Options
        addTasks={addTasks}
        handleTaskComplete={handleTaskComplete}
        handleDelete={handleDelete}
        handleEditTask={handleEditTask}
        // sortedItems={sorted}
        // handleSorted={setSorted}
      />
    </div>
  );
}

function Header() {
  return (
    <div className="container">
      <h1>✅ TODO</h1>
    </div>
  );
}

function TaskTracker({ addTasks }) {
  const tasksDone = addTasks.reduce((accumulate, task) => {
    return task.taskComplete ? accumulate + 1 : accumulate;
  }, 0);

  return (
    <div className="container">
      <div className="tile">
        <h1>Tasks Done</h1>
        <h2>Keep it up</h2>
        <div className="circle">
          <p>
            {tasksDone}/{addTasks.length}
          </p>
        </div>
      </div>
    </div>
  );
}

function TaskBar({
  onAddTask,
  addTasks,
  taskComplete,
  text,
  setText,
  editId,
  taskUpdate,
  setAddTasks,
  setEditId,
}) {
  function handleSubmit(e) {
    e.preventDefault();
    if (!text) return;
    if (text.length > 30) text = text.slice(0, 30);
    const isDuplicate = addTasks.some((task) => task.text === text);
    if (isDuplicate) {
      alert("Same task is already added");
      return;
    }

    const id = crypto.randomUUID();
    const newTask = {
      id,
      text,
      taskComplete,
      taskUpdate,
    };

    onAddTask(newTask);

    setText("");
  }

  function handleUpdate(e) {
    e.preventDefault();
    if (!text) return;

    if (text.length > 30) text = text.slice(0, 30);
    const taskToUpdate = addTasks.filter((task) => task.id === 12345);

    if (!taskToUpdate) return;
    if (taskToUpdate) {
      setAddTasks((tasks) =>
        tasks.map((task) =>
          task.id === editId ? { ...task, text: text, taskUpdate: false } : task
        )
      );

      setText("");
      setEditId(null);
    }
  }

  return (
    <div className="container taskbar ">
      <input
        type="text"
        placeholder="Type your task here"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button
        onSubmit={handleSubmit}
        addTasks={addTasks}
        onUpdate={handleUpdate}
        editId={editId}
      />
    </div>
  );
}
function Button({ onSubmit, addTasks, onUpdate, editId }) {
  const taskToUpdate = addTasks.find((task) => task.taskUpdate);
  const buttonLabel = taskToUpdate ? "Update" : "+";
  return (
    <div className={buttonLabel === "Update" ? "updatebutton" : "button"}>
      <button onClick={buttonLabel === "Update" ? onUpdate : onSubmit}>
        {buttonLabel}
      </button>
    </div>
  );
}

function TaskList({
  addTasks,
  handleTaskComplete,
  handleDelete,
  handleEditTask,
  sorted,
}) {
  console.log(sorted);
  return (
    <ul>
      {addTasks.map((item, key) => (
        <Task
          task={item}
          key={item.id}
          onClick={handleTaskComplete}
          handleDelete={handleDelete}
          handleEditTask={handleEditTask}
          // handleEditTask={handleEditTask}
        />
      ))}
    </ul>
  );
}
function Task({ task, onClick, handleDelete, handleEditTask }) {
  return (
    <li className="container-task individual-task">
      <div className="task-left">
        <div
          className={task.taskComplete ? "circle-task-done" : "circle-task"}
          onClick={() => onClick(task)}
        ></div>
        <p
          className={
            task.taskComplete ? "task-text task-strikethrough" : "task-text"
          }
        >
          {task.text}
        </p>
      </div>

      <div className="icon-container ">
        <button className="pen" onClick={() => handleEditTask(task)}>
          🖊️
        </button>
        <button className="trash" onClick={() => handleDelete(task)}>
          🚮
        </button>
      </div>
    </li>
  );
}
function Options({
  addTasks,
  handleTaskComplete,
  handleDelete,
  handleEditTask,
}) {
  let sorted = addTasks;
  const [option, setOption] = useState("original");

  if (option === "original") sorted = addTasks;

  if (option === "description")
    sorted = addTasks.slice().sort((a, b) => a.text.localeCompare(b.text));

  if (option === "completed")
    sorted = addTasks.slice().sort((a, b) => a.taskComplete - b.taskComplete);

  // console.log(sorted);
  return (
    <div>
      <TaskList
        sorted={sorted}
        addTasks={sorted}
        handleTaskComplete={handleTaskComplete}
        handleDelete={handleDelete}
        handleEditTask={handleEditTask}
      />

      <div className="container options">
        <label>Sort By </label>
        <select
          className="option"
          value={option}
          onChange={(op) => setOption(op.target.value)}
        >
          <option value="completed">Completed Tasks</option>
          <option value="description">Description</option>
          <option value="original">Original order</option>
        </select>
      </div>
    </div>
  );
}
