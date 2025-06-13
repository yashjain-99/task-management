import { createContext, useContext, useState } from "react";

const TasksContext = createContext({});

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    effort: "",
    dueDate: "",
  });

  return (
    <TasksContext.Provider value={{ tasks, setTasks, newTask, setNewTask }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasksContext = () => {
  const context = useContext(TasksContext);
  if (!context || Object.keys(context).length === 0) {
    throw new Error("useTasksContext must be used within a TasksProvider");
  }
  return context;
};

export default TasksContext;
