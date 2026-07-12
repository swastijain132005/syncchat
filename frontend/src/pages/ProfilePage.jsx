import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/chat-app-assets/assets.js";
import {useAuth} from '../../context/Authcontext.jsx'

const ProfilePage = () => {
  const navigate = useNavigate();
  const {user,updateProfile}=useAuth();

  const [selectedImg, setSelectedImg] = useState(null);
  const [fullName, setFullName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [password, setPassword] = useState();

  const onSubmitHandler = async(e) => {
    e.preventDefault();
    if(!selectedImg){
      await updateProfile({bio,fullName});
      navigate("/");
      return;
    }
    else{
      const reader = new FileReader();

reader.readAsDataURL(selectedImg);

reader.onload = async () => {
  const base64Image = reader.result;

  await updateProfile({
    profilePic: base64Image,
    name: fullName,
    bio,
  });

  navigate("/");
};
    }

    console.log({
      fullName,
      bio,
      password,
      selectedImg,
    });

    navigate("/");
  };

  return (
    <div
      className="fixed inset-0 bg-cover bg-center bg-no-repeat flex items-center justify-center"
  style={{
    backgroundImage: `url(${assets.background_img})`,
  }}
    >
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg">

        {/* Left */}
        <form
          onSubmit={onSubmitHandler}
          className="flex flex-col gap-5 p-10 flex-1"
        >
          <h3 className="text-lg font-medium">
            Profile details
          </h3>

          <label
            htmlFor="avatar"
            className="flex items-center gap-3 cursor-pointer"
          >
            <input
              type="file"
              id="avatar"
              hidden
              accept=".png,.jpg,.jpeg"
              onChange={(e) => setSelectedImg(e.target.files[0])}
            />

            <img
              src={
                selectedImg
                  ? URL.createObjectURL(selectedImg)
                  : assets.avatar_icon
              }
              alt=""
              className="w-14 h-14 rounded-full object-cover"
            />

            <span>Upload profile image</span>
          </label>

          <input
            type="text"
            placeholder="Your name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="p-2 border border-gray-500 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          <textarea
            rows={4}
            placeholder="Write profile bio"
            required
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="p-2 border border-gray-500 rounded-md bg-transparent resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
          ></textarea>

          <button
            type="submit"
            className="bg-gradient-to-r from-purple-400 to-violet-600 text-white py-3 rounded-full text-lg cursor-pointer"
          >
            Save
          </button>
        </form>

        {/* Right */}
        <img
          src={user?.profilePic || assets.avatar_icon}
          alt=""
          className={`max-w-44 aspect-square mx-10 max-sm:mt-10${selectedImg&&'rounded-full'}`}
        />
      </div>
    </div>
  );
};

export default ProfilePage;