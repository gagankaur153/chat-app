import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Createcontext from "../context/Createcontext";
import { FaUser } from "react-icons/fa";
import { toast } from "react-toastify";
import { IoSettings } from "react-icons/io5";
import api from "../lib/api";

const Navbar = () => {
  const { isauth, setIsauth, logininfo, sidebarvisible, setSidebarvisible } = useContext(Createcontext);
  const [infoshow, setInfoshow] = useState(false)
  const navigate = useNavigate();


  const handleinfo = ()=> {
    setInfoshow(!infoshow)
  }

  const handlelogout = async () => {
    try {
      const res = await api.post("/api/auth/logout", {});
     setSidebarvisible(false)
      setIsauth(false);
      localStorage.removeItem("token");
    localStorage.removeItem("sidebarvisible");
      toast.success(res?.data?.message);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header
      className={`fixed top-0 right-0 z-999 h-16 bg-white border-b border-gray-200 shadow-sm transition-all duration-300
      ${sidebarvisible ? " left-[51px] sm:left-[200px] md:left-[280px] lg:left-[300px] xl:left-[320px] px-6" : "left-0 px-6"}`}
    >
      <nav className="h-full flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <NavLink to="/" className="text-2xl font-bold text-violet-700">
          Chat
        </NavLink>

        {/* Right Side */}
        <div className="flex items-center gap-10">
          {isauth ? (
            <>
             <button
              type="button"
              onClick={handleinfo}
      
        className={`rounded-full hover:bg-gray-300 hover:text-black  transition-all duration-300 cursor-pointer bg-violet-700 text-white ${logininfo?.profilePic !== "" ? "" : "p-3"}`} 
            >
               {
          logininfo?.profilePic ? 
          <> <img src={logininfo?.profilePic} alt="photo" className="rounded-full h-10 w-10" /> </>
           : <>
            <FaUser /></>
         }
            </button>
            </>
           
          ) : (
            <>
              <NavLink
                to="/login"
                className="px-4 py-2 rounded-xl hover:bg-gray-100"
              >
                Login
              </NavLink>

              <NavLink
                to="/login"
                className="px-4 py-2 rounded-xl bg-violet-700 text-white hover:bg-violet-800"
              >
                Start Chatting
              </NavLink>
            </>
          )}
        </div>
      </nav>

      <div className="flex justify-end mt-3 relative">
  {infoshow && (
    <div className="w-62 bg-white border border-gray-200 rounded-2xl shadow-xl p-5 absolute top-2 right-0 animate-fadeIn">
      
      {/* User Top */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-12 h-12 rounded-full bg-violet-700 text-white flex items-center justify-center text-lg">
         {
          logininfo?.profilePic ? 
          <> <img src={logininfo?.profilePic} alt="photo" className="rounded-full h-full w-full" /> </>
           : <>
            <FaUser /></>
         }
        </div>

        <div>
          <h3 className="font-semibold text-gray-800">
            {logininfo?.username}
          </h3>
          <p className="text-sm text-gray-500 truncate">
            {logininfo?.email}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex flex-col gap-3">
        <NavLink to='/update'
         onClick={()=> {
         setSidebarvisible(true);
          handleinfo()
         }} 
         className="w-full py-2 text-center rounded-xl bg-violet-700 text-white hover:bg-violet-200 hover:text-black cursor-pointer transition">
          Update Profile
        </NavLink>

        <button
          onClick={()=> {
            handlelogout()
            handleinfo()
          }}
          className="w-full py-2 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 cursor-pointer transition"
        >
          Logout
        </button>
      </div>
    </div>
  )}
</div>
    </header>
  );
};

export default Navbar;
