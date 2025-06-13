import { Edit3, Trash2, Calendar, Clock } from "lucide-react";
import { getDaysUntilDue, getTaskStatusColor } from "../utils/task-utils";

const TaskCard = ({ task, handleEditTask, handleDeleteTask }) => {
  const daysUntil = getDaysUntilDue(task.dueDate);
  const statusColor = getTaskStatusColor(task.dueDate);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-semibold text-gray-900 text-lg leading-tight">
          {task.title}
        </h3>
        <div className="flex items-center space-x-1 ml-2">
          <button
            onClick={() => handleEditTask(task)}
            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteTask(task.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
          <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
