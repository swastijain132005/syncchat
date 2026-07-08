import React from "react";
import { useNavigate } from "react-router-dom";
import assets, {
  userDummyData,
} from "../assets/chat-app-assets/assets.js";

const Sidebar = ({ selectedUser, setSelectedUser }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-auto text-white ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      {/* Header */}
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img
            src={assets.logo}
            alt="logo"
            className="max-w-40"
          />

          <div className="relative py-2 group">
            <img
              src={assets.menu_icon}
              alt="Menu"
              className="max-h-5 cursor-pointer"
            />

            <div className="absolute top-full right-0 z-20 w-36 p-4 rounded-md bg-[#282142] border border-gray-600 hidden group-hover:block">
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer text-sm hover:text-violet-400"
              >
                Edit Profile
              </p>

              <hr className="my-2 border-gray-600" />

              <p className="cursor-pointer text-sm hover:text-violet-400">
                Logout
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative bg-[#282142] rounded-full flex items-center mt-5 px-4 py-3">
          <img
            src={assets.search_icon}
            alt="search"
            className="w-5"
          />

          <input
            type="text"
            placeholder="Search user..."
            className="flex-1 ml-3 bg-transparent outline-none border-none text-white text-sm placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Users */}
      <div className="flex flex-col gap-1">
        {userDummyData.map((user, index) => (
          <div
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-[#282142]/40 ${
              selectedUser?._id === user._id
                ? "bg-[#282142]/60"
                : ""
            }`}
          >
            <img
              src={user.profilePic || assets.avatar_icon}
              alt=""
              className="w-10 h-10 rounded-full object-cover"
            />

            <div className="flex flex-col">
              <p className="font-medium">{user.fullName}</p>

              {index < 3 ? (
                <span className="text-green-400 text-xs">
                  Online
                </span>
              ) : (
                <span className="text-gray-400 text-xs">
                  Offline
                </span>
              )}
            </div>

            {index > 2 && (
              <span className="absolute right-3 h-5 w-5 rounded-full bg-violet-600 flex items-center justify-center text-xs">
                {index}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;