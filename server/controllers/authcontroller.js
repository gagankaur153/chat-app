const User = require("../models/usermodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config({ quiet: true })


const secretkey = process.env.SECRET_KEY;
const isProduction = process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL);
const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
};

// REGISTER
const Register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const sameusername = await User.findOne({ username });
    if (sameusername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const sameemail = await User.findOne({ email });
    if (sameemail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashpassword,
    });
    await user.save();

    return res.status(201).json({
      message: "User registered successfully",
      data: user
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};



// LOGIN
const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email does not exist" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      secretkey,
      { expiresIn: "2d" }
    );

    res.cookie("mytoken", token, {
      ...cookieOptions,
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};



// GET USER INFO
const getinfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.status(200).json({ user });

  } catch (err) {
    res.status(500).json({ message: "Error fetching user", err: err });
  }
};

// update user 
const updateuser = async (req, res) => {
  try {
    const id = req.user.id;
    const { username, email, bio } = req.body;
    const image = req.file?.path;

    const payload = {
       username,
     email,
     bio,
     };

     if (image) {
     payload.profilePic = image;
     }

   const updateduser = await User.findByIdAndUpdate(
      id,
      payload,
       { new: true }
     ).select("-password");

   res.status(200).json({
       message: "Profile updated successfully",
     user: updateduser,
     });

  } catch (err) {
    console.log(err);

   
  }
};



// LOGOUT
const logout = async (req, res) => {
  try {
    res.clearCookie("mytoken", cookieOptions);

    res.status(200).json({ message: "Logout successful" });

  } catch (err) {
    res.status(500).json({ message: "Logout error", err: err });
  }
};


module.exports = {
  Register,
  Login,
  getinfo,
  updateuser,
  logout
};
