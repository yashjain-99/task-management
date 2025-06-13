import { useRef } from "react";
import { Plus, FileText, Download, Upload } from "lucide-react";
import useTaskActions from "../hooks/useTaskActions";
import { toast } from "react-hot-toast";
import { useAuthContext } from "../context/auth-context";
import axios from "../api/axios";
import { useTasksContext } from "../context/task-context";
import { useModalContext } from "../context/modal-context";

const Header = () => {
  const { exportTasks, bulkUploadTasks } = useTaskActions();
  const { tasks } = useTasksContext();
  const tasksCount = tasks.length || 0; // Ensure tasksCount is defined
  const fileInputRef = useRef(null);
  const { setAuth } = useAuthContext();
  const { setIsModalOpen } = useModalContext();

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout/", {}, { withCredentials: true });
      setAuth({});
    } catch (err) {
      console.error("Logout failed:", err);
      setAuth({});
    } finally {
      window.location.href = "/login";
    }
  };

  const handleExportTasks = async () => {
    try {
      const data = await exportTasks();
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "tasks.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Tasks exported successfully!");
    } catch (err) {
      console.error("Export failed:", err);
      toast.error("Failed to export tasks.");
    }
  };

  const handleBulkUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleBulkUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await bulkUploadTasks(file);
      toast.success("Tasks uploaded successfully!");
      window.location.reload();
    } catch (err) {
      console.error("Bulk upload failed:", err);
      toast.error("Failed to upload tasks. Please check your file format.");
    } finally {
      e.target.value = "";
    }
  };

  return (
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
            <button
              onClick={handleExportTasks}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export to Excel</span>
            </button>
            <button
              onClick={handleBulkUploadClick}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              type="button"
            >
              <Upload className="w-4 h-4" />
              <span>Bulk Upload</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleBulkUpload}
              className="hidden"
            />
            <button
              onClick={() => setIsModalOpen("create")}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
