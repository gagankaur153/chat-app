const User = require('../models/usermodel')
const Conversation = require('../models/conversationmodel')

const getUserBySearch = async(req,res) => {
    try{
        const search = req.query.search || ""
        const currentUserId = req.user.id
        const user = await User.find({
            $and:[
                {
                    $or:[
                        {username:{$regex:'.*'+search+'.*',$options:'i'}},
                        {fullname: {$regex:'.*'+search+'.*',$options:'i'}}
                    ]
                },{
                    _id:{$ne:currentUserId}
                }
            ]
        }).select("-password")

        res.status(200).send(user)

    }
    catch(err){
        console.log(err)
        res.status(500).send("internal server error")
    }

}
const getCurrentChatters = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const currentchatters = await Conversation.find({
      participants: currentUserId
    })
      .populate("participants", "-password")
      .sort({ updatedAt: -1 });

    if (!currentchatters || currentchatters.length === 0) {
      return res.status(200).send([]);
    }

    const users = currentchatters
      .map((chat) => {
        if (chat.isGroupChat) {
          return {
            _id: chat._id,
            username: chat.groupName,
            isGroupChat: true,
            participants: chat.participants,
            updatedAt: chat.updatedAt,
          };
        }

        return chat.participants.find(
          (p) => p._id.toString() !== currentUserId.toString()
        );
      })
      .filter(Boolean);

    return res.status(200).send(users);

  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
};


module.exports = {
    getUserBySearch,
    getCurrentChatters
}

