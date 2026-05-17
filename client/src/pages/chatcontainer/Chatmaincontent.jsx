import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import Createcontext from "../../context/Createcontext";
import { IoSend } from "react-icons/io5";
import { TiMessages } from "react-icons/ti";
import { FiArrowLeft } from "react-icons/fi";
import Loading from "../loading/Loading";
// import { Socket } from "socket.io-client";
import { FaUser } from "react-icons/fa";
import { useSocketContext } from "../../context/SocketContext";
import api from "../../lib/api";

const Chatmaincontent = () => {
  const {
    openChat,
    setOpenChat,
    chatLoading,
    setChatLoading,
    setRefreshSidebar,
    logininfo,
  } = useContext(Createcontext);

  const [typemessage, setTypemessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const { socket } = useSocketContext();

  const fetchMessages = useCallback(async () => {
    if (!openChat?._id) return;

    try {
      setChatLoading(true);

      const endpoint = openChat.isGroupChat
        ? `/api/message/group/${openChat._id}`
        : `/api/message/${openChat._id}`;

      const res = await api.get(endpoint);

      setMessages(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setChatLoading(false);
    }
  }, [openChat, setChatLoading]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      const senderId =
        typeof newMessage.senderId === "object"
          ? newMessage.senderId?._id
          : newMessage.senderId;

      const belongsToOpenChat = openChat?.isGroupChat
        ? newMessage.conversationId === openChat?._id
        : senderId === openChat?._id;

      if (belongsToOpenChat) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, openChat]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    if (chatLoading || messages.length === 0) return;

    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  }, [messages, chatLoading, openChat]);

  const sendmessage = async () => {
    try {
      if (!typemessage.trim()) return;

      const endpoint = openChat.isGroupChat
        ? `/api/message/group/send/${openChat._id}`
        : `/api/message/send/${openChat._id}`;

      const res = await api.post(endpoint, { message: typemessage });

      setMessages((prev) => [...prev, res.data]);
      setTypemessage("");

      // sidebar refresh
      setRefreshSidebar((prev) => !prev);
    } catch (error) {
      console.log(error);
    }
  };

  if (!openChat) {
    return (
      <div className="h-full flex-1 flex flex-col items-center justify-center gap-3">
        <h1 className="text-3xl font-bold text-purple-700">
          {`Welcome ${logininfo ? logininfo?.username : ""}`}
        </h1>
        <TiMessages className="text-8xl text-purple-500" />
      </div>
    );
  }

  return (
    <div className="h-full w-full flex bg-purple-50 flex-col">
      {/* Header */}
      <div className="bg-white flex gap-3 sm:gap-5 items-center sm:px-12 border-b border-b-gray-200 p-4 mb-3">
       <button
        type="button"
        onClick={() => setOpenChat(null)}
        className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 md:hidden"
        aria-label="Back to conversations"
       >
        <FiArrowLeft className="text-xl" />
       </button>

       {
        openChat?.isGroupChat ? <>
        <div className="rounded-full bg-blue-100 p-2 text-blue-700">
          <FaUser/>
        </div>
        </> : openChat?.profilePic ? <>
        <img src={openChat?.profilePic} alt="" className="h-10 w-10 rounded-full" />
        </> : <> <div className="rounded-full hover:bg-gray-300 hover:text-black  transition-all duration-300 cursor-pointer bg-blue-700 text-white p-2">
          <FaUser/>
        </div>
        </>
       }
        <h1 className="text-xl font-medium">{openChat.username || openChat.groupName}</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 sm:px-10 overflow-auto p-4">
        {chatLoading ? (
          <Loading />
        ) : messages.length === 0 ? (
        <div className="flex h-100 justify-center items-center">
          <p className="text-4xl animate-bounce">
            Send a message to start Conversation.
          </p>
          </div>
          
        ) : (
          messages.map((msg) => {
            const senderId =
              typeof msg?.senderId === "object" ? msg.senderId?._id : msg?.senderId;
            const isMine = senderId === logininfo?._id;

            return (
              <div
                key={msg._id}
                className={`chat ${isMine ? "chat-end" : "chat-start"}`}
              >
              <div className="flex flex-col"
               
              >
                {openChat.isGroupChat && !isMine && (
                  <span className="mb-1 text-xs font-medium text-slate-500">
                    {msg.senderId?.username || "Member"}
                  </span>
                )}
                <div  className={`chat-bubble-info px-4 flex items-end gap-2 space-y-4 text-white py-1 max-w-xs ${
                  isMine
                    ? "bg-gray-600 rounded-xl rounded-br-none"
                    : "bg-purple-600 rounded-xl rounded-bl-none"
                }`}>{msg?.message}</div>

                <div className="opacity-70  text-[10px] self-end">
                  {new Date(msg.createdAt).toLocaleTimeString(
                    "en-IN",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    }
                  )}
                </div>
              </div>
            </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="mt-3 mb-2 relative">
        <input
          type="text"
          placeholder="Typing..."
          className="w-full p-4 rounded-full border border-purple-500"
          value={typemessage}
          onChange={(e) => setTypemessage(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && sendmessage()
          }
        />

        <IoSend
          className="absolute right-4 top-4 text-2xl text-purple-700 cursor-pointer"
          onClick={sendmessage}
        />
      </div>
    </div>
  );
};

export default Chatmaincontent;
