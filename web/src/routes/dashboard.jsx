import Header from "../components/Header";
import TaskList from "../components/TaskList";
import TaskModal from "../components/TaskModal";
import { useModalContext } from "../context/modal-context";

const TaskManagementApp = () => {
  const { isModalOpen } = useModalContext();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <TaskList />
      </div>

      {isModalOpen && <TaskModal />}
    </div>
  );
};

export default TaskManagementApp;
