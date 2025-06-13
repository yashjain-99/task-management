import { useState, useEffect } from "react";
import useTaskActions from "../hooks/useTaskActions";
import Header from "../components/Header";
import TaskList from "../components/TaskList";
import TaskModal from "../components/TaskModal";
import { toast } from "react-hot-toast";

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
  const { getTasks, createTask, updateTask, deleteTask } = useTaskActions();

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
      toast.error("Please fill in all required fields");
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
        toast.success("Task updated successfully!");
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
        toast.success("Task created successfully!");
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
      toast.error("Failed to save task.");
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
        toast.success("Task deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete task.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        tasksCount={tasks.length}
        setShowCreateModal={setShowCreateModal}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <TaskList
          tasks={tasks}
          handleEditTask={handleEditTask}
          handleDeleteTask={handleDeleteTask}
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
    </div>
  );
};

export default TaskManagementApp;
