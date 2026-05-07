const mongoose = require ("mongoose")

const conversationmodel = new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    message: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            default: []
        }
    ]
}, {timestamps: true})

const Conversation = mongoose.model("Conversation", conversationmodel)

module.exports = Conversation