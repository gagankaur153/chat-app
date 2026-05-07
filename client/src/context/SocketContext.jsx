import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import Createcontext from "./Createcontext";
import { SOCKET_URL } from "../lib/api";

const SocketContext = createContext();

export const useSocketContext=()=>{
    return useContext(SocketContext);
}

export const SocketContextProvider=({children})=>{
    const [socket , setSocket]= useState(null);
    const [onlineUser,setOnlineUser]=useState([]);
    const {logininfo} = useContext(Createcontext);
    useEffect(()=>{
        if(logininfo){
            const socket = io(SOCKET_URL,{
                withCredentials: true,
                query:{
                    userId:logininfo?._id,
                }
            })
            socket.on("getOnlineUsers",(users)=>{
                setOnlineUser(users)
            });
            setSocket(socket);
            return()=>socket.close();
        }else{
            if(socket){
                socket.close();
                setSocket(null); 
            }
        }
    },[logininfo]);
    return(
    <SocketContext.Provider value={{socket , onlineUser}}>
        {children}
    </SocketContext.Provider>
    )
}
