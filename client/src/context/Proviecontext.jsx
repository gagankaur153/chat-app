import React, { useEffect, useMemo, useState } from "react";
import Createcontext from "./Createcontext";
import api from "../lib/api";

const Proviecontext = ({ children }) => {
  const [isauth, setIsauth] = useState(false);
  const [logininfo, setLogininfo] = useState(null);

  const [sidebarLoading, setSidebarLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);


  // refresh pe bhi same rahe
  const [sidebarvisible, setSidebarvisible] = useState(() => {
    const saved = localStorage.getItem("sidebarvisible");
    return saved ? JSON.parse(saved) : false;
  });

  const [openChat, setOpenChat] = useState(null);
  const [refreshSidebar, setRefreshSidebar] = useState(false);

  // token check
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsauth(!!token);
  }, []);

  // user info
  useEffect(() => {
    if (!isauth) return;

    api
      .get("/api/auth/me")
      .then((res) => setLogininfo(res.data.user))
      .catch((err) => console.log(err));
  }, [isauth]);

  // sidebar state save
  useEffect(() => {
    localStorage.setItem(
      "sidebarvisible",
      JSON.stringify(sidebarvisible)
    );
  }, [sidebarvisible]);

  const sidebarshow = () => {
    setSidebarvisible((prev) => !prev);
  };

  const value = useMemo(
    () => ({
      isauth,
      setIsauth,

      logininfo,
      setLogininfo,

      sidebarLoading,
      setSidebarLoading,

      chatLoading,
      setChatLoading,

      sidebarvisible,
      setSidebarvisible,
      sidebarshow,

      openChat,
      setOpenChat,

      refreshSidebar,
      setRefreshSidebar,

    }),
    [
      isauth,
      logininfo,
      sidebarLoading,
      chatLoading,
      sidebarvisible,
      openChat,
      refreshSidebar,
    ]
  );

  return (
    <Createcontext.Provider value={value}>
      {children}
    </Createcontext.Provider>
  );
};

export default Proviecontext;
