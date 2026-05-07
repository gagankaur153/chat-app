// import React, { useContext, useEffect, useState, useRef } from "react";
// import Createcontext from "../context/Createcontext";
// import api from "../lib/api";
// import { toast } from "react-toastify";

// const UpdateProfile = () => {
//   const {
//     setSidebarvisible,
//     logininfo,
//     setLogininfo,
//   } = useContext(Createcontext);

//   const fileInputref = useRef(null);

//   const [loading, setLoading] = useState(false);

//   const [updateinfo, setUpdateinfo] = useState({
//     username: "",
//     email: "",
//     bio: "",
//     profilePic: "",
//   });

//   const [file, setfile] = useState(null);

//   // fill old data
//   useEffect(() => {
//     if (logininfo) {
//       setUpdateinfo({
//         username: logininfo.username || "",
//         email: logininfo.email || "",
//         bio: logininfo.bio || "",
//         profilePic: logininfo.profilePic || "",
//       });
//     }
//   }, [logininfo]);

//   // hide sidebar
//   useEffect(() => {
//     setSidebarvisible(false);
//   }, []);

//   // input handler
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setUpdateinfo((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // file handler (FIXED)
//   const filehandler = (e) => {
//     const selected = e.target.files?.[0];
//     if (!selected) return;

//     setfile(selected);

//     // preview image instantly
//     setUpdateinfo((prev) => ({
//       ...prev,
//       profilePic: URL.createObjectURL(selected),
//     }));
//   };

//   // submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       setLoading(true);

//       const formData = new FormData();
//       formData.append("username", updateinfo.username);
//       formData.append("email", updateinfo.email);
//       formData.append("bio", updateinfo.bio);

//       // IMPORTANT FIX (must match backend multer field)
//       if (file) {
//         formData.append("profilePic", file);
//       }

//       const res = await api.put("/api/auth/update", formData);

//       console.log(res.data);

//       toast.success(res.data.message);
//       //  navigate("/chathome");

//       if (res.data.user) {
//         setLogininfo(res.data.user);
//       }
//     } catch (err) {
//       console.log(err);
//       toast.error("update failed")
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="pt-28 px-6 min-h-screen bg-gray-100">
//       <div className="max-w-3xl mx-auto bg-white shadow rounded-2xl p-6 border border-gray-200">
//         <h1 className="text-2xl font-bold text-violet-700 mb-6">
//           Update Profile
//         </h1>

//         <form onSubmit={handleSubmit} className="space-y-5">

//           {/* profile image */}
//           <div className="flex justify-center">
//             <img
//               src={
//                 updateinfo.profilePic
//                   ? updateinfo.profilePic
//                   : "https://img.freepik.com/premium-vector/male-face-avatar-icon-set-flat-design-social-media-profiles_1281173-3806.jpg"
//               }
//               alt="profile"
//               className="h-24 w-24 rounded-full object-cover border"
//             />
//           </div>

//           {/* file input */}
//           <div>
//             <label className="block mb-2 text-sm font-medium">
//               Profile Image
//             </label>

//             <input
//               type="file"
//               ref={fileInputref}
//               onChange={filehandler}
//               className="w-full border border-gray-300 rounded-xl px-4 py-3"
//             />
//           </div>

//           {/* username */}
//           <div>
//             <label className="block mb-2 text-sm font-medium">
//               Username
//             </label>

//             <input
//               type="text"
//               name="username"
//               value={updateinfo.username}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded-xl px-4 py-3"
//             />
//           </div>

//           {/* email */}
//           <div>
//             <label className="block mb-2 text-sm font-medium">
//               Email
//             </label>

//             <input
//               type="email"
//               name="email"
//               value={updateinfo.email}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded-xl px-4 py-3"
//             />
//           </div>

//           {/* bio */}
//           <div>
//             <label className="block mb-2 text-sm font-medium">
//               Bio
//             </label>

//             <textarea
//               rows="4"
//               name="bio"
//               value={updateinfo.bio}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded-xl px-4 py-3"
//             />
//           </div>

//           {/* button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="px-6 py-3 rounded-xl bg-violet-700 text-white hover:bg-violet-500 disabled:opacity-60"
//           >
//             {loading ? "Updating..." : "Save Changes"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UpdateProfile;
import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Createcontext from "../context/Createcontext";
import api from "../lib/api";
import { toast } from "react-toastify";

const UpdateProfile = () => {
  const { setSidebarvisible, logininfo, setLogininfo } =
    useContext(Createcontext);

  const navigate = useNavigate();
  const fileInputref = useRef(null);

  const [loading, setLoading] = useState(false);
  const [updateinfo, setUpdateinfo] = useState({
    username: "",
    email: "",
    bio: "",
    profilePic: "",
  });

  const [file, setfile] = useState(null);

  useEffect(() => {
    if (logininfo) {
      setUpdateinfo({
        username: logininfo.username || "",
        email: logininfo.email || "",
        bio: logininfo.bio || "",
        profilePic: logininfo.profilePic || "",
      });
    }
  }, [logininfo]);



  useEffect(() => {
    setSidebarvisible(false);
  }, [setSidebarvisible]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUpdateinfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filehandler = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setfile(selected);

    setUpdateinfo((prev) => ({
      ...prev,
      profilePic: URL.createObjectURL(selected),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("username", updateinfo.username);
      formData.append("email", updateinfo.email);
      formData.append("bio", updateinfo.bio);

      if (file) {
        formData.append("profilePic", file);
      }

      const res = await api.put("/api/auth/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(res.data.message || "Profile updated");

      if (res.data.user) {
        setLogininfo(res.data.user);
      }

      setSidebarvisible(true);

      navigate("/chathome");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 px-6 min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto bg-white shadow rounded-2xl p-6 border border-gray-200">
        <h1 className="text-2xl font-bold text-violet-700 mb-6">
          Update Profile
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex justify-center">
            <img
              src={
                updateinfo.profilePic
                  ? updateinfo.profilePic
                  : "https://img.freepik.com/premium-vector/male-face-avatar-icon-set-flat-design-social-media-profiles_1281173-3806.jpg"
              }
              alt="profile"
              className="h-24 w-24 rounded-full object-cover border"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Profile Image
            </label>

            <input
              type="file"
              ref={fileInputref}
              onChange={filehandler}
              accept="image/*"
              className="w-full border border-gray-300 rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Username</label>

            <input
              type="text"
              name="username"
              value={updateinfo.username}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Email</label>

            <input
              type="email"
              name="email"
              value={updateinfo.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Bio</label>

            <textarea
              rows="4"
              name="bio"
              value={updateinfo.bio}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-violet-700 text-white hover:bg-violet-500 disabled:opacity-60"
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;