import { useEffect } from "react";
import TaskCard from "./TaskCard";
import { Plus, FileText } from "lucide-react";
import { useTasksContext } from "../context/task-context";
import useTaskActions from "../hooks/useTaskActions";
import { useModalContext } from "../context/modal-context";
import toast from "react-hot-toast";

const TaskList = () => {
  const { tasks, setTasks, setNewTask } = useTasksContext();
  const { getTasks, deleteTask } = useTaskActions();
  const { setIsModalOpen } = useModalContext();
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
        console.error("Failed to fetch tasks:", err);
        setTasks([]);
      }
    };
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleEditTask = (task) => {
    setNewTask(task);
    setIsModalOpen("edit");
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(id);
        setTasks((prev) => prev.filter((task) => task.id !== id));
        toast.success("Task deleted successfully!");
      } catch (err) {
        console.error("Failed to delete task:", err);
        toast.error("Failed to delete task.");
      }
    }
  };
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
        <p className="text-gray-500 mb-6">
          Create your first task to get started
        </p>
        <button
          onClick={() => setIsModalOpen("create")}
          className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors mx-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Task</span>
        </button>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          handleEditTask={handleEditTask}
          handleDeleteTask={handleDeleteTask}
        />
      ))}
    </div>
  );
};

export default TaskList;
