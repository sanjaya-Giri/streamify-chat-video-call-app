import User from '../models/User.js';
import FriendRequest from '../models/FriendRequest.js';

export async function getRecommendedUsers(req, res) {
    try {
        const  currentUserId  = req.user.id;
        const currentUser=req.user;
        const recommendedUsers = await User.find({
           $and: [
            { _id: { $ne: currentUserId } },
            { _id: { $nin: currentUser.friends } },
            {isOnboarded: true}
           ]
        })
        res.status(200).json({ users: recommendedUsers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function getMyFriends(req, res) {
    try {
        const user=await User.findById(req.user.id)
        .select("friends")
        .populate("friends","fullName  profilePicture nativeLanguage learningLanguages");
        res.status(200).json(user.friends);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function sendFriendRequest (req,res){
    try {
        const myId=req.user.id;
        const {id:recipientId}=req.params;

        if(myId===recipientId){
            return res.status(400).json({message:"You cannot send friend request to yourself"});
        }
        const recipient=await User.findById(recipientId);
        if(!recipient){
            return res.status(404).json({message:"Recipient user not found"});
        }

        if(recipient.friends.includes(myId)){
            return res.status(400).json({message:"You are already friends with this user"});
        }

        const existingRequest=await FriendRequest.findOne({
         $or:[
            {sender:myId,recipient:recipientId},
            {sender:recipientId,recipient:myId}
         ]   
        });
         if(existingRequest){
            return res.status(400).json({message:"A friend request already exists between you and this user"});
         }
        const friendRequest=await FriendRequest({
            sender:myId,
            recipient:recipientId,
        });
        await friendRequest.save();
        res.status(200).json({message:"Friend request sent successfully"
        })

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function acceptFriendRequest (req,res){
  try {
    const {id:requestId}=req.params;

    const friendRequest=await FriendRequest.findById(requestId);
    if(!friendRequest){
        return res.status(404).json({message:"Friend request not found"});
    }
    if(friendRequest.recipient.toString()!==req.user.id){
        return res.status(403).json({message:"You are not authorized to accept this friend request"});
    }
    friendRequest.status="accepted";
    await friendRequest.save();

    await User.findByIdAndUpdate(friendRequest.sender,{
        $push:{friends:friendRequest.recipient}
    });
    await User.findByIdAndUpdate(friendRequest.recipient,{
        $push:{friends:friendRequest.sender}
    });
    res.status(200).json({message:"Friend request accepted successfully"});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getFriendRequests(req,res){
    try {
        const incomingRequests=await FriendRequest.find({
            recipient:req.user.id,
            status:"pending"
        }).populate("sender","fullName profilePicture nativeLanguage learningLanguages");

        const acceptedRequests=await FriendRequest.find({
            recipient:req.user.id,
            status:"accepted"
        }).populate("sender","fullName profilePicture ");
        res.status(200).json({
            incomingRequests,
            acceptedRequests
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export async function getOutgoingFriendReqs(req,res){
    try {
        const outgoingRequests=await FriendRequest.find({
            sender:req.user.id,
            status:"pending"
        }).populate("recipient","fullName profilePic nativeLanguage learningLanguages");
        res.status(200).json({ outgoingRequests });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}