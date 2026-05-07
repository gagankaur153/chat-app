import React, { useContext, useEffect, useState } from "react";
import Createcontext from "../../context/Createcontext";
import { useSocketContext } from "../../context/SocketContext";
import { CgProfile } from "react-icons/cg";
import ChatUserItem from "./ChatUserItem";
import { SiGooglemessages } from "react-icons/si";
import api from "../../lib/api";

const Chatsidebar = () => {
  const {
    sidebarLoading,
    setSidebarLoading,
    setOpenChat,
    openChat,
    refreshSidebar,
    
  } = useContext(Createcontext);

  const { onlineUser, socket } = useSocketContext();

  const [usersearch, setUsersearch] = useState("");
  const [user, setUser] = useState([]);

  // unread notifications
  const [unreadMessages, setUnreadMessages] = useState({});


  // Check user online/offline
  const isOnline = (userId) => {
    return onlineUser?.includes(userId);
  };


  // Fetch all users
  const fetchUsers = async () => {
    try {
      setSidebarLoading(true);

      const res = await api.get("/api/users/getuser");

      setUser(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setSidebarLoading(false);
    }
  };

  // First load + refresh
  useEffect(() => {
    fetchUsers();
  }, [refreshSidebar]);


  useEffect(() => {
    if (!usersearch.trim()) {
      fetchUsers();
      return;
    }

    const delay = setTimeout(async () => {
      try {
        setSidebarLoading(true);

        const res = await api.get(`/api/users/search?search=${usersearch}`);

        setUser(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setSidebarLoading(false);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [usersearch]);

  // =========================
  // Listen new messages
  // =========================
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      const senderId = newMessage.senderId;

      // agar current chat open nahi hai
      if (openChat?._id !== senderId) {
        setUnreadMessages((prev) => ({
          ...prev,
          [senderId]: (prev[senderId] || 0) + 1,
        }));
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, openChat]);

  // =========================
  // Open chat
  // =========================
  const handleOpenChat = (data) => {
    setOpenChat(data);

    // notification remove
    setUnreadMessages((prev) => ({
      ...prev,
      [data._id]: 0,
    }));
  };

  return (
    <div className="h-full bg-gray-50 px-1 sm:px-5 py-4">
      <div className="flex gap-2 items-center">
        <div className=" text-4xl sm:text-5xl text-blue-800"> <SiGooglemessages /></div>
     <div className="">
       <h1 className=" hidden sm:block sm:text-xl font-semibold">Messages</h1>
       <p className=" hidden sm:block sm:text-xs text-gray-200">Connect with your teams</p>
     </div>
</div>
     <div className="mt-10">
       {/* Search */}
      <input
        type="text"
        placeholder="Search conversation..."
        className="w-full border border-gray-200 bg-white rounded-lg px-1 sm:px-3 py-2 outline-none"
        value={usersearch}
        onChange={(e) => setUsersearch(e.target.value)}
      />

      {/* Users */}
      <div className="space-y-2 mt-10 overflow-aut">
        {sidebarLoading ? (
          <p>Loading...</p>
        ) : (
         user.map((data) => (
  <ChatUserItem
    key={data._id}
    data={data}
    isOnline={isOnline(data._id)}
    unreadCount={unreadMessages[data._id] || 0}
    handleOpenChat={handleOpenChat}
  />
))
        )}
      </div>
     </div>
    </div>
  );
};

export default Chatsidebar;
