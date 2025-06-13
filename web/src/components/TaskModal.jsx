import Modal from "react-modal";
import { useModalContext } from "../context/modal-context";
import { useTasksContext } from "../context/task-context";
import toast from "react-hot-toast";
import useTaskActions from "../hooks/useTaskActions";

Modal.setAppElement("#root");

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0,0,0,0.3)",
    backdropFilter: "blur(6px)",
    zIndex: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
  },
  content: {
    position: "static",
    inset: "unset",
    background: "rgba(255,255,255,0.85)",
    borderRadius: "1rem",
    boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
    padding: "1.5rem",
    width: "100%",
    maxWidth: "28rem",
    margin: "auto",
    border: "none",
    overflow: "visible",
  },
};

const TaskModal = () => {
  const { isModalOpen, setIsModalOpen } = useModalContext();
  const { setTasks, newTask, setNewTask } = useTasksContext();
  const { createTask, updateTask } = useTaskActions();
  const isEditMode = isModalOpen === "edit";
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim() || !newTask.effort || !newTask.dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      if (isModalOpen === "edit") {
        const updated = await updateTask(newTask.id, {
          title: newTask.title,
          description: newTask.description,
          effort_days: Number(newTask.effort),
          due_date: newTask.dueDate,
        });
        setTasks((prev) =>
          prev.map((t) =>
            t.id === newTask.id
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
      setIsModalOpen(null);
      setNewTask({
        title: "",
        description: "",
        effort: "",
        dueDate: "",
      });
    } catch (err) {
      console.error("Failed to save task:", err);
      toast.error("Failed to save task.");
    }
  };
  return (
    <Modal
      isOpen={true}
      onRequestClose={() => {
        setIsModalOpen(null);
        setNewTask({
          title: "",
          description: "",
          effort: "",
          dueDate: "",
        });
      }}
      style={customStyles}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      contentLabel={isEditMode ? "Edit Task" : "Create New Task"}
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        {isEditMode ? "Edit Task" : "Create New Task"}
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
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
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
            onChange={(e) => setNewTask({ ...newTask, effort: e.target.value })}
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
              setIsModalOpen(null);
              setNewTask({
                title: "",
                description: "",
                effort: "",
                dueDate: "",
              });
            }}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateTask}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            {isEditMode ? "Update Task" : "Create Task"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TaskModal;
