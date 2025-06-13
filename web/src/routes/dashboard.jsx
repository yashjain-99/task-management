import React, { useState, useRef, useEffect } from "react";
import useTaskActions from "../hooks/useTaskActions";
import axios from "../api/axios";
import { useAuthContext } from "../context/auth-context";
import Header from "../components/Header";
import TaskList from "../components/TaskList";
import TaskModal from "../components/TaskModal";

const TaskManagementApp = () => {
  const [tasks, setTasks] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    effort: "",
    dueDate: "",
  });
  const fileInputRef = useRef(null);
  const { getTasks, createTask, updateTask, deleteTask } = useTaskActions();
  const { setAuth } = useAuthContext();

  // Fetch tasks on mount (replace with real API call if available)
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks();
        setTasks(
          data.map((t) => ({
            ...t,
            effort: t.effort_days,
            dueDate: t.due_date,
          }))
        );
      } catch (err) {
        setTasks([]);
      }
    };
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim() || !newTask.effort || !newTask.dueDate) {
      alert("Please fill in all required fields");
      return;
    }
    try {
      if (editingTask) {
        const updated = await updateTask(editingTask.id, {
          title: newTask.title,
          description: newTask.description,
          effort_days: Number(newTask.effort),
          due_date: newTask.dueDate,
        });
        setTasks((prev) =>
          prev.map((t) =>
            t.id === editingTask.id
              ? {
                  ...t,
                  ...updated,
                  effort: updated.effort_days,
                  dueDate: updated.due_date,
                }
              : t
          )
        );
      } else {
        const created = await createTask({
          title: newTask.title,
          description: newTask.description,
          effort_days: Number(newTask.effort),
          due_date: newTask.dueDate,
        });
        setTasks((prev) => [
          ...prev,
          {
            ...created,
            effort: created.effort_days,
            dueDate: created.due_date,
          },
        ]);
      }
      setShowCreateModal(false);
      setEditingTask(null);
      setNewTask({
        title: "",
        description: "",
        effort: "",
        dueDate: "",
      });
    } catch (err) {
      alert("Failed to save task.");
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description,
      effort: task.effort.toString(),
      dueDate: task.dueDate,
    });
    setShowCreateModal(true);
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(id);
        setTasks((prev) => prev.filter((task) => task.id !== id));
      } catch (err) {
        alert("Failed to delete task.");
      }
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout/", {}, { withCredentials: true });
      setAuth({});
    } catch (err) {
      setAuth({});
    }
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTaskStatusColor = (dueDate) => {
    const daysUntil = getDaysUntilDue(dueDate);
    if (daysUntil < 0) return "text-red-600 bg-red-50";
    if (daysUntil <= 2) return "text-orange-600 bg-orange-50";
    return "text-green-600 bg-green-50";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        tasksCount={tasks.length}
        setShowCreateModal={setShowCreateModal}
        handleLogout={handleLogout}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <TaskList
          tasks={tasks}
          handleEditTask={handleEditTask}
          handleDeleteTask={handleDeleteTask}
          getDaysUntilDue={getDaysUntilDue}
          getTaskStatusColor={getTaskStatusColor}
          setShowCreateModal={setShowCreateModal}
        />
      </div>

      {showCreateModal && (
        <TaskModal
          editingTask={editingTask}
          newTask={newTask}
          setNewTask={setNewTask}
          setShowCreateModal={setShowCreateModal}
          setEditingTask={setEditingTask}
          handleCreateTask={handleCreateTask}
        />
      )}

      {/* Hidden file input for CSV upload */}
      {/* 
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="hidden"
      />
      */}
    </div>
  );
};

export default TaskManagementApp;
