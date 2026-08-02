
import Message from "../models/messageSchema.js";
import mongoose from "mongoose";
import Chat from "../models/chatSchema.js";

export const getRecentChat = async(req,res)=>{
    try {
        const chats = await chatSchema.find({userId : req.user._id}).select('chatName updatedAt').sort({updatedAt : -1});

        return res.status(200).json({
            messaage: "All Chats are here", 
            chats
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const getChatById = async(req,res)=>{
   try {
     const {chatId} = req.params;

     const chat = await chatSchema.findOne({_id: chatId, userId : req.user._id}); 
     if(!chat) return res.status(500).json({messaage : "sorry, chat not found"})
     return res.status(200).json({
        message : "chat is here", 
        chatId : chat._id,
        userId : chat.userId,
        topic : chat.chatName,
        usage : chat.usage
     })
   } catch (error) {
      return res.status(500).json({
        messaage : "Internal Server Error"
      })
   }
}

export const deleteChat = async(req,res)=>{
    try {
        const {chatId} = req.params,

        const chat = await chatSchema.findOne({userId : req.user._id , _id : chatId});
        if(!chat) return res.status(403).json({message : "chat not found"});

        await Message.deleteMany({
            chatId : chat._id,
        })
        await chatSchema.deleteOne({_id : chatId});

        return res.status(200).json({message : "Chat deleted Successfully"});
    } catch (error) {
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

export const markAsFavChat = async(req,res)=>{
    try {
        const {chatId} = req.params; 

        const chat = await chatSchema.findOne({userId : req.user._id, chatId});
        if(!chat) return res.status(403).json({
            message : "Chat not founnd"
        })

        chat.isFavorite = true; 
        await chat.save();

        return res.status(200).json({
            message : "chat mark as favourite"
            
        })
        
    } catch (error) {
        res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

export const getAllFavChat = async(req,res)=>{
    try {
          const chats = await chatSchema.find({userId : req.user_id}).select('chatName isFavorite updateAt').sort({updatedAt : -1});

          return res.status(200).json({
            message : 'all chats are here',
            chats
          })
    } catch (error) {
        res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

export const newChat = async(req,res)=>{
    try {
        const {model} = req.body; 
        if(!model){
            return res.status(403).json({
                message : "Model can't find"
            })
        }

        const chat = await chatSchema.create({userId : req.user._id, model : model})

        return res.status(201).json({
            message : "Chat created succesfully", 
            chatId = chat._id,
            topic : chat.chatName,
            userId : chat.userId,
            createdAt: chat.createdAt
        })
    } catch (error) {
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}