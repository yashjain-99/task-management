import Modal from "react-modal";

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

const TaskModal = ({
  editingTask,
  newTask,
  setNewTask,
  setShowCreateModal,
  setEditingTask,
  handleCreateTask,
}) => (
  <Modal
    isOpen={true}
    onRequestClose={() => {
      setShowCreateModal(false);
      setEditingTask(null);
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
    contentLabel={editingTask ? "Edit Task" : "Create New Task"}
  >
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
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
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
  </Modal>
);

export default TaskModal;
