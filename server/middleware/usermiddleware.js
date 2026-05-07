const jwt = require("jsonwebtoken");
require("dotenv").config({ quiet: true })

const matchtoken = (req, res, next) => {
  try {
    const token = req.cookies?.mytoken;
     const key = process.env.SECRET_KEY 
    if (!token) {
      return res.status(401).json({ message: "User unauthorized" });
    }

    const decoded = jwt.verify(token, key);
 if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = decoded; 

    next(); 

  } catch (err) {
    console.log(err)
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = matchtoken;
