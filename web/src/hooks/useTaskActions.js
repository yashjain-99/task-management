import useAxiosPrivate from "./useAxiosPrivate";

const useTaskActions = () => {
  const axiosPrivate = useAxiosPrivate();

  // Create a new task
  const createTask = async (taskData) => {
    const response = await axiosPrivate.post("/task/tasks/", taskData);
    return response.data;
  };

  // Update an existing task by id
  const updateTask = async (id, taskData) => {
    const response = await axiosPrivate.put(`/task/tasks/${id}/`, taskData);
    return response.data;
  };

  // Delete a task by id
  const deleteTask = async (id) => {
    await axiosPrivate.delete(`/task/tasks/${id}/`);
    return true;
  };

  // Get list of tasks
  const getTasks = async () => {
    const response = await axiosPrivate.get("/task/tasks/");
    return response.data;
  };

  // Export tasks as Excel
  const exportTasks = async () => {
    const response = await axiosPrivate.get("/task/export/", {
      responseType: "blob",
    });
    return response.data;
  };

  // Bulk upload tasks from file
  const bulkUploadTasks = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axiosPrivate.post("/task/bulk_upload/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  };

  return {
    createTask,
    updateTask,
    deleteTask,
    getTasks,
    exportTasks,
    bulkUploadTasks,
  };
};

export default useTaskActions;
