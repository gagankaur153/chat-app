import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import {toast} from "react-toastify"
import api from "../lib/api"

const Register = ()=>{
   const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const onchangehandler = (e)=>{
const {name, value} = e.target
setForm({
  ...form,
  [name]: value
})
  }

  const onsubmithandler =async (e)=>{
    setLoading(true)
e.preventDefault()
api.post("/api/auth/register",{
  username: form.username,
  email: form.email,
  password:form.password
})
.then((res)=>{
  toast.success(res?.data?.message)
navigate('/login')
setLoading(false)
})
.catch((err)=>{
  toast.error("something else ! ")
  console.log(err)
  setLoading(false)
}
)




  }

 

  return (
    <div className="min-h-screen flex py-30 items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="bg-white shadow-2xl rounded-2xl m-5 p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-500 text-sm mt-1">Join the chat and start messaging</p>
        </div>

        <form  className="space-y-5" onSubmit={onsubmithandler}>
          {/* Username */}
          <div>
            <label  className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
value={form.username}
onChange={onchangehandler}
              placeholder="john_doe"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onchangehandler}
              placeholder="example@email.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
            {/* {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )} */}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onchangehandler}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
            {/* {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )} */}
          </div>

          {/* confirm password */}
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
            {/* {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )} */}
          </div>

           <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-2.5 rounded-lg font-medium transition duration-200 shadow-md ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Loading..." : "signin"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account? <span className="text-indigo-600 font-medium cursor-pointer" >

            <NavLink to={"/login"}>Login</NavLink>
          </span>
        </p>
      </div>
    </div>
  );
}



export default Register
