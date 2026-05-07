const express = require("express");
const router = express.Router();

const {
  Register,
  Login,
  getinfo,
  logout,
  updateuser
} = require("../controllers/authcontroller");

const matchtoken = require("../middleware/usermiddleware");
const upload = require("../middleware/cloudinary");


// ✅ Register
router.post("/register", Register);

// ✅ Login
router.post("/login", Login);

// ✅ Get Logged-in User Info (Protected)
router.get("/me", matchtoken, getinfo);

// update
router.put("/update",
  matchtoken, (req,res,next)=>{
  upload.single("profilePic")(req,res,function(err){
    if(err){
      return res.status(400).json({
        message: err.message,
        error: err
      });
    }
    next();
  });
}, updateuser);

// ✅ Logout
router.post("/logout", logout);


module.exports = router;