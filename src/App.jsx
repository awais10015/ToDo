import React, { useEffect, useState } from "react";
import Task from "./Task";
import { useRef } from "react";
import myImage from "./assets/sleep.webp";

const App = () => {
  const [user, setUser] = useState("");
  const [work, setWork] = useState("");
  const username = useRef();
  const workToDo = useRef();
  const [task, setTask] = useState([]);
  const [showTask, setShowTask] = useState(true);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      try {
        const parsed = JSON.parse(storedTasks);
        if (Array.isArray(parsed)) {
          setTask(parsed);
        } else {
          setTask([]);
        }
      } catch (e) {
        console.error("Error", e);
        setTask([]);
      }
    }
  }, []);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    localStorage.setItem("tasks", JSON.stringify(task));
  }, [task]);

  function handleSubmit(e) {
    e.preventDefault();
    const userValue = username.current.value;
    const workValue = workToDo.current.value;
    const randomId = crypto.randomUUID();

    setUser(userValue);
    setWork(workValue);
    const newTask = {
      id: randomId,
      user: userValue,
      task: workValue,
    };
    setTask((prevTasks) => [...prevTasks, newTask]);
    username.current.value = "";
    workToDo.current.value = "";
  }

  return (
    <>
      <div className="w-full h-20 px-6 bg-blue-500 flex items-center justify-between shadow-md">
        <p className="text-3xl font-bold text-white tracking-wide">TO DO</p>
        <button
          onClick={() => setShowTask((prev) => !prev)}
          className="px-4 py-2 bg-white text-blue-600 rounded-xl shadow hover:bg-blue-100 transition"
        >
          {showTask ? "Hide Tasks" : "Show Tasks"}
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-4 items-center justify-center p-6 bg-white shadow-lg rounded-lg mx-auto mt-6 max-w-2xl"
      >
        <input
          ref={username}
          placeholder="Enter Your Name"
          className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-1/3"
          type="text"
          required
        />

        <input
          ref={workToDo}
          placeholder="Enter Your Task"
          className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-1/3"
          type="text"
          required
        />

        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition w-full sm:w-auto"
        >
          Submit Task
        </button>
      </form>

      {!showTask || task.length === 0 ? (
        <div className="flex justify-center items-center mt-6">
          <img src={myImage} alt="No Tasks" className="w-60 h-auto" />
        </div>
      ) : (
        <div className="flex justify-center items-center gap-4 mt-6 px-4">
          {task.map((t, index) => (
            <div className="flex flex-col items-center justify-center">
              <Task key={index} user={t.user} work={t.task} />
              <button
                onClick={() => {
                  const updatedTasks = [...task];
                  updatedTasks.splice(index, 1);
                  setTask(updatedTasks);
                  localStorage.setItem("tasks", JSON.stringify(updatedTasks)); 
                }}
                className="mt-2 border-none bg-red-500 text-center text-white p-2 rounded-3xl font-bold"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default App;
