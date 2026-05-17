import React, { useContext } from "react";
import Createcontext from "../../context/Createcontext";
import Chatsidebar from "./Chatsidebar";
import Chatmaincontent from "./Chatmaincontent";

const Chathome = () => {
  const { openChat } = useContext(Createcontext);

  return (
    <div className="fixed inset-x-0 bottom-0 top-16 flex overflow-hidden bg-slate-50 md:flex-row">
      {/* Sidebar: mobile par chat open hone ke baad hide, desktop par hamesha side me */}
      <div
        className={`h-full w-full shrink-0 md:block md:w-[300px] lg:w-[340px] ${
          openChat ? "hidden" : "block"
        }`}
      >
        <Chatsidebar />
      </div>

      {/* Main chat: mobile par user select hone ke baad open, desktop par side me visible */}
      <div
        className={`h-full min-w-0 flex-1 md:flex ${
          openChat ? "flex" : "hidden"
        }`}
      >
        <Chatmaincontent />
      </div>
    </div>
  );
};

export default Chathome;
