import React from "react";
import { CgProfile } from "react-icons/cg";
import { MdGroups } from "react-icons/md";

const ChatUserItem = ({
  data,
  isActive,
  isOnline,
  unreadCount,
  handleOpenChat,
}) => {

  return (
    <button
      type="button"
      onClick={() => handleOpenChat(data)}
      className={`group flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 ${
        isActive
          ? "border-blue-200 bg-blue-50 shadow-sm"
          : "border-transparent bg-white hover:border-slate-200 hover:bg-slate-50"
      }`}
    >
      <div className="relative">
        {data.isGroupChat ? (
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-700 ring-2 ring-white">
            <MdGroups className="text-2xl" />
          </div>
        ) : data.profilePic ? (
          <img
            src={data?.profilePic}
            alt=""
            className="h-11 w-11 rounded-full object-cover ring-2 ring-white"
          />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-600 ring-2 ring-white">
            <CgProfile className="text-2xl" />
          </div>
        )}
      

        {isOnline ? (
          <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500"></span>
        ) : (
          <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-slate-300"></span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900">
          {data.username || data.groupName}
        </p>
        <p
          className={`mt-0.5 text-xs ${
            isOnline ? "text-emerald-600" : "text-slate-400"
          }`}
        >
          {data.isGroupChat ? "Group chat" : isOnline ? "Online" : "Offline"}
        </p>
      </div>

      {unreadCount > 0 && (
        <div className="ml-auto flex h-6 min-w-6 items-center justify-center rounded-full bg-blue-600 px-2 text-xs font-semibold text-white shadow-sm">
          {unreadCount > 99 ? "99+" : unreadCount}
        </div>
      )}
    </button>
  );
};

export default React.memo(ChatUserItem);
