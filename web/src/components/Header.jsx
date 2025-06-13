import React from "react";
import { Plus, FileText } from "lucide-react";

const Header = ({ tasksCount, setShowCreateModal, handleLogout }) => (
  <div className="bg-white shadow-sm border-b">
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-100 rounded-lg p-2">
            <FileText className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
            <p className="text-sm text-gray-500">{tasksCount} tasks</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {/* CSV import/export buttons can be added here */}
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
);

export default Header;
