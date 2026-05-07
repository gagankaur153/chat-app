const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
         required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    profilePic: {
         type: String,
         default: ""
    },
    bio: {
        type: String,
        default: ""
    },
   isstatus: {
    type: String,
   enum: ["online", "offline"],
   default: "offline"
   }
}, 
{timestamps: true})

const User = mongoose.model("User", userSchema)

module.exports = User