import React from "react";
import TaskCard from "./TaskCard";
import { Plus, FileText } from "lucide-react";

const TaskList = ({
  tasks,
  handleEditTask,
  handleDeleteTask,
  getDaysUntilDue,
  getTaskStatusColor,
  setShowCreateModal,
}) => {
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
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors mx-auto"
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
          getDaysUntilDue={getDaysUntilDue}
          getTaskStatusColor={getTaskStatusColor}
        />
      ))}
    </div>
  );
};

export default TaskList;
