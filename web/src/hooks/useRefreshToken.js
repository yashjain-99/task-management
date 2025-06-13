import axios from "../api/axios";
import { useAuthContext } from "../context/auth-context";

const useRefreshToken = () => {
  const { setAuth } = useAuthContext();
  const refresh = async () => {
    const response = await axios.get("/auth/refresh", {
      withCredentials: true,
    });
    setAuth((prev) => {
      return { ...prev, accessToken: response.data.access };
    });
    return response.data.access;
  };
  return refresh;
};

export default useRefreshToken;
