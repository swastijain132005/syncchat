import { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "../utils/axiosclient.jsx";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import {useNavigate} from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const navigate=useNavigate();


  // ---------------- CHECK AUTH ----------------

  const checkAuth = async () => {
    try {
      const { data } = await axiosClient.get("/api/users/checkAuth");

      if (data.success) {
        setUser(data.user);

        if (data.token) {
          setToken(data.token);
          localStorage.setItem("token", data.token);
        }

        connectSocket(data.user);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ---------------- LOGIN / SIGNUP ----------------

  const login = async (state, credentials) => {
    try {
      const { data } = await axiosClient.post(
        `/api/users/${state}`,
        credentials
      );

      if (data.success) {
        setUser(data.user);
        setToken(data.token);

        localStorage.setItem("token", data.token);

        connectSocket(data.user);

        toast.success(data.message);
        navigate("/");
      } else {
        toast.error(data.message || data.error);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // ---------------- LOGOUT ----------------

  const logout = () => {
    localStorage.removeItem("token");

    setToken(null);
    setUser(null);
    setOnlineUsers([]);

    if (socket&&socket.connected) {
      socket.disconnect();
      setSocket(null);
    }

    toast.success("Logged out");
  };

  // ---------------- UPDATE PROFILE ----------------

  const updateProfile = async (profileData) => {
    try {
      const { data } = await axiosClient.put(
        "/api/users/updateProfile",
        profileData
      );

      if (data.success) {
        setUser(data.user);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // ---------------- SOCKET ----------------

  const connectSocket = (userData) => {
    if (!userData) return;

    if (socket?.connected) {
      return;
    }

    const newSocket = io(import.meta.env.VITE_BACKEND_URL, {
      query: {
        userId: userData._id,
      },
    });

    newSocket.on("connect", () => {
      console.log("Socket Connected");
    });

    newSocket.on("getonlineUsers", (users) => {
      setOnlineUsers(users);
    });

    setSocket(newSocket);
  };

  // ---------------- EFFECTS ----------------

  useEffect(() => {
    if (token) {
      checkAuth();
    }
  }, [token]);

  // ---------------- CONTEXT VALUE ----------------

  const value = {
    axios: axiosClient,

    token,
    setToken,

    user,
    setUser,

    onlineUsers,

    socket,

    login,
    logout,
    updateProfile,

    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);