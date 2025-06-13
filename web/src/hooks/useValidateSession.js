import axios from "../api/axios";

const validateSession = async (setAuth) => {
  const url = `/auth/refresh/`;
  try {
    const res = await axios.post(
      url,
      {},
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (res.status == 200 && res.data) {
      setAuth({ accessToken: res.data.access });
      return true;
    }
    if (res.status !== 200) {
      return false;
    }
  } catch (error) {
    console.error("Error validating session:", error);
    return false;
  }
};

export default validateSession;
