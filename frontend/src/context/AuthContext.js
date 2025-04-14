// Root/frontend/src/context/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001"; // Fallback to localhost for local development

  console.log(localStorage.getItem("token"));

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
          config.headers.Authorization = `Bearer ${storedToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, []);

  useEffect(() => {
    console.log("Token changed:", token);
    console.log("Current role:", role);
    console.log("Current userId: ", userId);

    const fetchProfileAndVerify = async () => {
      if (token && !userId) {
        console.log(
          "AuthContext: Token exists but userId is missing, attempting to fetch profile ..."
        );
        try {
          const res = await axios.get(`${API_URL}/myprofile`, {
            withCredentials: true,
          });
          console.log("AuthContext: Profile fetched from backend: ", res.data);

          if (res.data.role) {
            setRole(res.data.role);
            localStorage.setItem("role", res.data.role);
          } else {
            console.warn("Role not found in profile response");
            setRole(null);
            localStorage.removeItem("role");
          }

          if (res.data.userId) {
            const fetchUserId = String(res.data.userId);
            setUserId(fetchUserId);
            localStorage.setItem("userId", fetchUserId);
            console.log("AuthContext: userId set from profile", fetchUserId);
          } else {
            console.error("AuthContext: userId NOT found in profile response!");
          }
        } catch (error) {
          console.error(
            "AuthContext: Problem fetching profile or verifying token: ",
            error.response?.data || error.message
          );
          console.error("Full error object:", error);

          setRole(null);
          localStorage.removeItem("role");
          handleLogout();
        }
      }
    };
    fetchProfileAndVerify();
  }, [token]);

  const handleLogin = (newToken, userRole, loggedInUserId) => {
    if (!loggedInUserId) {
      console.error("handleLogin ERROR: loggidInUser is missing!");
      return;
    }
    const userIdString = String(loggedInUserId);
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", userRole);
    localStorage.setItem("userId", userIdString);

    setToken(newToken);
    setRole(userRole);
    setUserId(userIdString);
    console.log(
      "AuthContext: handleLogin successfull. Role: ",
      userRole,
      "UserId: ",
      userIdString
    );
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      setToken(null);
      setRole(null);
      console.log("Logged out - Token and role cleared", token, role);
    } catch (error) {
      console.error("Logout failed", error.response?.data || error.message);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");
      setRole(null);
      setToken(null);
      setUserId(null);
      console.log("Logged out - Token, role, and userId cleared");
    }
  };

  return (
    <AuthContext.Provider
      value={{ token, role, userId, handleLogin, handleLogout }}
    >
      {children}{" "}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
