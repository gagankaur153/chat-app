import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import Createcontext from "../../context/Createcontext";
import { useSocketContext } from "../../context/SocketContext";
import ChatUserItem from "./ChatUserItem";
import { SiGooglemessages } from "react-icons/si";
import { FiPlus, FiSearch, FiX } from "react-icons/fi";
import { MdOutlineGroupAdd } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { toast } from "react-toastify";
import api from "../../lib/api";

const Chatsidebar = () => {
  const {
    sidebarLoading,
    setSidebarLoading,
    setOpenChat,
    openChat,
    refreshSidebar,
    allusers,
    setAllusers,
    groupChatOpen,
    setGroupChatOpen,
    setRefreshSidebar,
  } = useContext(Createcontext);

  const { onlineUser, socket } = useSocketContext();

  const [usersearch, setUsersearch] = useState("");
  const [user, setUser] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [directChatOpen, setDirectChatOpen] = useState(false);
  const [directUserSearch, setDirectUserSearch] = useState("");
  const [allUsersLoading, setAllUsersLoading] = useState(false);
  const hasLoadedSidebar = useRef(false);

  // unread notifications
  const [unreadMessages, setUnreadMessages] = useState({});


  // Check user online/offline
  const isOnline = (userId) => {
    return onlineUser?.includes(userId);
  };


  // Fetch current conversations. Refresh silently after the first load.
  const fetchUsers = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) {
        setSidebarLoading(true);
      }

      const res = await api.get("/api/users/getuser");

      setUser(res.data);
      hasLoadedSidebar.current = true;
    } catch (error) {
      console.log(error);
    } finally {
      if (showLoading) {
        setSidebarLoading(false);
      }
    }
  }, [setSidebarLoading]);


  const fetchAllUsers = useCallback(async () => {
    try {
      setAllUsersLoading(true);

      const res = await api.get("/api/message/alluser");

      setAllusers(res.data.data || []);
    } catch (error) {
      console.log(error);
      toast.error("Users load failed");
    } finally {
      setAllUsersLoading(false);
    }
  }, [setAllusers]);

  // First load + refresh
  useEffect(() => {
    fetchUsers(!hasLoadedSidebar.current);
  }, [fetchUsers, refreshSidebar]);


  useEffect(() => {
    if (!usersearch.trim()) {
      if (hasLoadedSidebar.current) {
        fetchUsers(false);
      }

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
  }, [fetchUsers, setSidebarLoading, usersearch]);

  // =========================
  // Listen new messages
  // =========================
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      const senderId =
        typeof newMessage.senderId === "object"
          ? newMessage.senderId?._id
          : newMessage.senderId;
      const unreadKey = newMessage.receiverId
        ? senderId
        : newMessage.conversationId;

      // agar current chat open nahi hai
      if (openChat?._id !== unreadKey && openChat?._id !== senderId) {
        setUnreadMessages((prev) => ({
          ...prev,
          [unreadKey]: (prev[unreadKey] || 0) + 1,
        }));
      }
    };

    const handleNewGroup = () => {
      setRefreshSidebar((prev) => !prev);
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("newGroup", handleNewGroup);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("newGroup", handleNewGroup);
    };
  }, [socket, openChat, setRefreshSidebar]);

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

  const openDirectChatPicker = () => {
    setDirectChatOpen(true);
    setDirectUserSearch("");
    fetchAllUsers();
  };

  const closeDirectChatPicker = () => {
    setDirectChatOpen(false);
    setDirectUserSearch("");
  };

  const handleStartDirectChat = (member) => {
    setOpenChat(member);
    closeDirectChatPicker();

    setUnreadMessages((prev) => ({
      ...prev,
      [member._id]: 0,
    }));
  };

  const toggleMember = (memberId) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const resetGroupForm = () => {
    setGroupName("");
    setSelectedMembers([]);
    setGroupChatOpen(false);
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      toast.error("Group name required");
      return;
    }

    if (selectedMembers.length < 2) {
      toast.error("Select at least 2 members");
      return;
    }

    try {
      setCreatingGroup(true);

      const res = await api.post("/api/message/group", {
        groupName,
        members: selectedMembers,
      });

      const group = {
        ...res.data,
        username: res.data.groupName,
        isGroupChat: true,
      };

      setOpenChat(group);
      setRefreshSidebar((prev) => !prev);
      resetGroupForm();
      toast.success("Group created");
    } catch (error) {
      toast.error(error.response?.data?.message || "Group create failed");
      console.log(error);
    } finally {
      setCreatingGroup(false);
    }
  };

  const filteredDirectUsers = allusers?.filter((member) => {
    const search = directUserSearch.trim().toLowerCase();
    if (!search) return true;

    return [member.username, member.fullname, member.email]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(search));
  });

  return (
    <aside className="relative flex h-full min-h-0 w-full flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-4 py-5 sm:px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-2xl text-white shadow-sm">
            <SiGooglemessages />
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-semibold text-slate-950">
              Messages
            </h1>
            <p className="truncate text-sm text-slate-500">
              Connect with your teams
            </p>
          </div>

          <button
            type="button"
            onClick={openDirectChatPicker}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-xl text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            aria-label="Start direct chat"
            title="Start direct chat"
          >
            <FiPlus />
          </button>

          <button
            type="button"
            onClick={() => setGroupChatOpen(true)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-xl text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            aria-label="Create group chat"
            title="Create group chat"
          >
            <MdOutlineGroupAdd />
          </button>
        </div>

        <div className="relative mt-5">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-400" />
          <input
            type="text"
            placeholder="Search conversation"
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            value={usersearch}
            onChange={(e) => setUsersearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1  min-h-0 overflow-y-auto px-3 py-3 sm:px-4">
        {sidebarLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="flex animate-pulse items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3"
              >
                <div className="h-11 w-11 rounded-full bg-slate-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-2/3 rounded bg-slate-200" />
                  <div className="h-2 w-1/3 rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        ) : user.length === 0 ? (
          <div className="flex h-full items-center justify-center px-4 text-center">
            <p className="text-sm font-medium text-slate-500">
              No conversations found
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {user.map((data) => (
              <ChatUserItem
                key={data._id}
                data={data}
                isActive={openChat?._id === data._id}
                isOnline={isOnline(data._id)}
                unreadCount={unreadMessages[data._id] || 0}
                handleOpenChat={handleOpenChat}
              />
            ))}
          </div>
        )}
      </div>
      {directChatOpen && (
        <div className="absolute inset-0 z-20 flex items-end bg-slate-950/30 p-3 sm:items-center sm:justify-center">
          <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-2xl sm:max-w-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-slate-950">
                  New message
                </h2>
                <p className="text-sm text-slate-500">
                  Select a user to start chatting
                </p>
              </div>

              <button
                type="button"
                onClick={closeDirectChatPicker}
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Close direct chat"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            <div className="space-y-4 px-5 py-5">
              <div className="relative">
                <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-400" />
                <input
                  type="text"
                  placeholder="Search users"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  value={directUserSearch}
                  onChange={(e) => setDirectUserSearch(e.target.value)}
                />
              </div>

              <div className="max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-2">
                {allUsersLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="flex animate-pulse items-center gap-3 rounded-lg bg-white p-3"
                      >
                        <div className="h-10 w-10 rounded-full bg-slate-200" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 w-2/3 rounded bg-slate-200" />
                          <div className="h-2 w-1/2 rounded bg-slate-200" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredDirectUsers?.length > 0 ? (
                  <div className="space-y-2">
                    {filteredDirectUsers.map((member) => (
                      <button
                        type="button"
                        key={member._id}
                        onClick={() => handleStartDirectChat(member)}
                        className="flex w-full cursor-pointer items-center gap-3 rounded-lg bg-white p-3 text-left transition hover:bg-blue-50"
                      >
                        {member.profilePic ? (
                          <img
                            src={member.profilePic}
                            alt=""
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                            <CgProfile className="text-2xl" />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {member.username}
                          </p>
                          <p className="truncate text-xs text-slate-500">
                            {member.email}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="py-6 text-center text-sm font-medium text-slate-500">
                    No users found
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {groupChatOpen && (
        <div className="absolute inset-0 z-20 flex items-end bg-slate-950/30 p-3 sm:items-center sm:justify-center">
          <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-2xl sm:max-w-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-slate-950">
                  Create group
                </h2>
                <p className="text-sm text-slate-500">
                  Start a group conversation
                </p>
              </div>

              <button
                type="button"
                onClick={resetGroupForm}
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Close group chat"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            <div className="space-y-4 px-5 py-5">
              <input
                type="text"
                placeholder="Group name"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />

              <div className="max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-2">
                {allusers?.length > 0 ? (
                  <div className="space-y-2">
                    {allusers.map((member) => (
                      <label
                        key={member._id}
                        className="flex cursor-pointer items-center gap-3 rounded-lg bg-white p-3 transition hover:bg-blue-50"
                      >
                        {member.profilePic ? (
                          <img
                            src={member.profilePic}
                            alt=""
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                            <CgProfile className="text-2xl" />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {member.username}
                          </p>
                          <p className="truncate text-xs text-slate-500">
                            {member.email}
                          </p>
                        </div>

                        <input
                          type="checkbox"
                          checked={selectedMembers.includes(member._id)}
                          onChange={() => toggleMember(member._id)}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="py-6 text-center text-sm font-medium text-slate-500">
                    No users found
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleCreateGroup}
                disabled={creatingGroup}
                className="h-11 w-full rounded-xl bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {creatingGroup ? "Creating..." : "Continue"}
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Chatsidebar;
