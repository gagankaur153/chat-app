import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { toast } from "react-toastify";
import Createcontext from "../context/Createcontext";
import api from "../lib/api";

const Login = () => {
  const [loading, setLoading] = useState(false);

  const { setIsauth, setSidebarvisible } = useContext(Createcontext);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const validate = (name, value) => {
    let message = "";

    if (name === "email" && !/\S+@\S+\.\S+/.test(value)) {
      message = "Enter valid email";
    }

    if (name === "password" && value.length < 6) {
      message = "Password minimum 6 characters";
    }

    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });
    validate(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await api.post(
        "/api/auth/login",
        {
          email: form.email,
          password: form.password,
        },
      );

      localStorage.setItem("token", "true");
      setIsauth(true);
      setSidebarvisible(true);

      toast.success(res?.data?.message || "Login Success");

      navigate("/chathome");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-blue-50 to-indigo-100">
      <div className="bg-white m-2 shadow-2xl rounded-2xl p-8 w-full max-w-md mt-20">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            Welcome Back
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Login to continue chatting
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@email.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email}
              </p>
            )}
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
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password}
              </p>
            )}
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
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?{" "}
          <span className="text-indigo-600 font-medium">
            <NavLink to="/signin">Register</NavLink>
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
