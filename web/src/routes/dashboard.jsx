import React, { useState, useRef, useEffect } from "react";
import {
  Plus,
  FileDown,
  Upload,
  Edit3,
  Trash2,
  Calendar,
  Clock,
  FileText,
} from "lucide-react";

import useTaskActions from "../hooks/useTaskActions";
import axios from "../api/axios";
import { useAuthContext } from "../context/auth-context";

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

  // Commented out: CSV import/export handlers
  // const handleFileUpload = (e) => {};
  // const exportToExcel = () => {};

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
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-100 rounded-lg p-2">
                <FileText className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
                <p className="text-sm text-gray-500">{tasks.length} tasks</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* 
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Import CSV</span>
              </button>
              <button
                onClick={exportToExcel}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FileDown className="w-4 h-4" />
                <span>Export</span>
              </button>
              */}
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New Task</span>
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tasks yet
            </h3>
            <p className="text-gray-500 mb-6">
              Create your first task to get started
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create Task</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => {
              const daysUntil = getDaysUntilDue(task.dueDate);
              const statusColor = getTaskStatusColor(task.dueDate);

              return (
                <div
                  key={task.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                      {task.title}
                    </h3>
                    <div className="flex items-center space-x-1 ml-2">
                      <button
                        onClick={() => handleEditTask(task)}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {task.description}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>
                          {task.effort} day{task.effort !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}
                      >
                        {daysUntil < 0
                          ? `${Math.abs(daysUntil)} days overdue`
                          : daysUntil === 0
                          ? "Due today"
                          : `${daysUntil} days left`}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create/Edit Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editingTask ? "Edit Task" : "Create New Task"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter task description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Effort (Days) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newTask.effort}
                  onChange={(e) =>
                    setNewTask({ ...newTask, effort: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Number of days"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date *
                </label>
                <input
                  type="date"
                  required
                  value={newTask.dueDate}
                  onChange={(e) =>
                    setNewTask({ ...newTask, dueDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingTask(null);
                    setNewTask({
                      title: "",
                      description: "",
                      effort: "",
                      dueDate: "",
                    });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTask}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {editingTask ? "Update Task" : "Create Task"}
                </button>
              </div>
            </div>
          </div>
        </div>
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
