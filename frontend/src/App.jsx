import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import { Toaster } from "react-hot-toast";
import {useAuth} from '../context/Authcontext.jsx'

const App = () => {
  const {user}=useAuth();
  return (
    <div className="bg-[url('/src/assets/chat-app-assets/bgimage.svg')] bg-cover bg-center bg-no-repeat w-screen h-screen">
      <Toaster/>
      <Routes>
        <Route path="/" element={user?<HomePage />:<Navigate to="/login"/>}/>
        <Route path="/login" element={!user?<LoginPage />:<Navigate to="/"/>} />
        <Route path="/profile" element={user?<ProfilePage />:<Navigate to="/login"/>} />
      </Routes>
    </div>
  );
};

export default App;