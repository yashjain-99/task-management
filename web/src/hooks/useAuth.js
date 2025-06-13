import { useEffect, useState } from "react";
import { useAuthContext } from "../context/auth-context";
import axios from "../api/axios";

const useAuth = (body, isFromRegister) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const endpoint = isFromRegister ? "register" : "login";
  const url = `/auth/${endpoint}/`;
  const { setAuth } = useAuthContext();
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (body && body?.username && body?.password) {
          setLoading(true);
          const response = await axios.post(url, JSON.stringify(body), {
            withCredentials: true,
          });

          if (!response) {
            const errorData = response.data;
            throw new Error(errorData.error);
          }

          const resData = response.data;

          if (!isFromRegister) {
            setAuth({ accessToken: resData.access });
          }

          if (isFromRegister) {
            window.location.href = "/login";
          } else {
            window.location.href = "/";
          }

          setData(resData);
          setError(null);
          setLoading(false);
        }
      } catch (error) {
        setError(error?.response?.data?.error || "An error occurred.");
        setLoading(false);
      }
    };

    fetchData();
  }, [body, isFromRegister]);

  return { data, loading, error };
};

export default useAuth;
