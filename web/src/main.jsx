import "./index.css";
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Auth from "./routes/auth";
import Error from "./routes/error";
import toast, { Toaster } from "react-hot-toast";
import validateSession from "./hooks/useValidateSession";
import { AuthProvider, useAuthContext } from "./context/auth-context";
import TaskManagementApp from "./routes/dashboard";

const rootElement = createRoot(document.getElementById("root"));

const ProtectedRoutes = ({ children }) => {
  const [validated, setValidated] = useState(null);
  const { auth, setAuth } = useAuthContext();
  useEffect(() => {
    const validate = async () => {
      try {
        const isValidSession = await validateSession(setAuth);
        if (!isValidSession) {
          toast.error("Session expired. Please log in again.");
        }
        setValidated(isValidSession);
      } catch (error) {
        console.error("Error validating session:", error);
        setValidated(false);
      }
    };
    if (auth.accessToken) {
      setValidated(true);
    } else {
      validate();
    }
  }, []);
  if (validated === null) return <div>Validating</div>;
  if (validated) return children;
  return <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoutes>
                  <TaskManagementApp />
                </ProtectedRoutes>
              }
            />
            <Route path="/login" element={<Auth isSignUp={false} />} />
            <Route path="/signup" element={<Auth isSignUp={true} />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      <Toaster position="top-left" />
    </>
  );
};

rootElement.render(<App />);
