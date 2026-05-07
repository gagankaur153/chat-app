import React from "react";
import Chatsidebar from "./Chatsidebar";
import Chatmaincontent from "./Chatmaincontent";

const Chathome = () => {
  return (
    <div className="relative h-screen flex overflow-hidden">
      {/* Sidebar */}
      <div className="hidde sm:block w-[50px] sm:w-[200px] md:w-[280px] lg:w-[300px] xl:w-[320px]">
        <Chatsidebar />
      </div>

      {/* Main */}
      <div className="pt-16 flex-1 border-l border-purple-200">
        <Chatmaincontent />
      </div>
    </div>
  );
};

export default Chathome;