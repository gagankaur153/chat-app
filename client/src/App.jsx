import { Route, Routes } from 'react-router'
import './App.css'
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify"
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'
import Navbar from './pages/Navbar'
import Chathome from './pages/chatcontainer/Chathome';
import { useContext, useEffect, useMemo } from 'react';
import io from 'socket.io-client'
import { useState } from 'react';
import UpdateProfile from './pages/UpdateProfile';
import ProtectedRoute from './pages/ProtectedRoute';
import Createcontext from './context/Createcontext';

function App() {
  const { logininfo } = useContext(Createcontext)
  useEffect(() => {
    localStorage.getItem("token")
  })
  return (
    <>

      <Navbar />
      <Routes>
        <Route path='/' element={localStorage.getItem("token") ? <Chathome /> : <Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signin' element={<Register />} />
        <Route path='/chathome' element={<ProtectedRoute><Chathome /></ProtectedRoute>} />
        <Route path='/update' element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />
      </Routes>
       <ToastContainer autoClose={2000} position="top-right"/> 

    </>
  )
}

export default App
