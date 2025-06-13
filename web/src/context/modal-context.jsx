import { createContext, useContext, useState } from "react";

const ModalContext = createContext({});

export const ModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(null);

  return (
    <ModalContext.Provider value={{ isModalOpen, setIsModalOpen }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context || Object.keys(context).length === 0) {
    throw new Error("useModalContext must be used within a ModalProvider");
  }
  return context;
};

export default ModalContext;
