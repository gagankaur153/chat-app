import React from "react";
import { CgProfile } from "react-icons/cg";

const ChatUserItem = ({
  data,
  isOnline,
  unreadCount,
  handleOpenChat,
}) => {

  return (
    <div
      onClick={() => handleOpenChat(data)}
      className=" py-3 sm:p-3 flex flex-col sm:flex-row items-center gap-1 sm:gap-3 bg-white rounded-lg cursor-pointer shadow-xs transition-all duration-150 border border-transparent hover:border-gray-200 hover:shadow-md"
    >
      <div className="relative">
        {data.profilePic ?
        <>
        <img src={data?.profilePic} alt="" className=" h-10 w-10 rounded-full" /></>  : (  <CgProfile className="text-3xl text-gray-700" />)}
      

        {isOnline && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
        )}
      </div>

      <p className="text-xs sm:text-lg">{data.username}</p>

      {unreadCount > 0 && (
        <div className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
         + {unreadCount}
        </div>
      )}
    </div>
  );
};

export default React.memo(ChatUserItem);