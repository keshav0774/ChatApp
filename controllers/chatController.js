
import Message from "../models/messageSchema.js";
import mongoose from "mongoose";
import Chat from "../models/chatSchema.js";
import messageRouter from "../routes/messageRoutes.js";

export const getRecentChat = async(req,res)=>{
    try {
        const chats = await Chat.find({userId : req.user._id}).select('topic updatedAt').sort({updatedAt : -1});

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

     const chat = await Chat.findOne({_id: chatId, userId : req.user._id}); 
     if(!chat) return res.status(500).json({messaage : "sorry, chat not found"})
     return res.status(200).json({
        message : "chat is here", 
        chatId : chat._id,
        userId : chat.userId,
        topic : chat.topic,
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
        
        const {chatId} = req.params;

        const chat = await Chat.findOne({userId : req.user._id , _id : chatId});
        if(!chat) return res.status(403).json({message : "chat not found"});

        await Message.deleteMany({
            chatId : chat._id,
        })
        await Chat.deleteOne({_id : chatId});

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
       
         const {favorite} = req.body;
         const chat = await Chat.findOne({userId : req.user._id, _id: chatId});
        if(!chat) return res.status(403).json({
            message : "Chat not founnd"
        })

        chat.isFavorite = favorite; 
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
          const chats = await Chat.find({userId : req.user._id, isFavorite: true}).select('topic isFavorite updatedAt').sort({updatedAt : -1});

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

        const chat = await Chat.create({userId : req.user._id, model : model})

        return res.status(201).json({
            message : "Chat created succesfully", 
            chatId : chat._id,
            topic : chat.topic,
            userId : chat.userId,
            createdAt: chat.createdAt
        })
    } catch (error) {
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

export const searchChat = async(req,res)=>{  
    try {
        const { q } = req.query;

        if(!q?.trim()){
            return res.status(404).json({
                message : "Search query is reqired"
            });
        }

        const chats = await Chat.find({
            userId : req.user._id,
            topic :{
                $regex : q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),

                $options : 'i'
            }
        })
        .select("_id topic updatedAt")
        .sort({updatedAt : -1})
        .limit(20);

        if (chats.length === 0) {
             return res.status(200).json({
                message: "No chats found",
                chats: []
            });
        }

        return res.status(200).json({
            message : "Chat are here", 
            chats
        })
    } catch (error) {
        
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

export const renameChat = async(req,res)=>{
    try {
        const { chatId } = req.params;

        const {topic} = req.body;

        if(!topic?.trim()){
            return res.status(404).json({
                message : "Enter chat name"
            });
        }

        const chat = await Chat.findOne({
            userId : req.user._id,
            _id : chatId
        });
        
        if(!chat){
            return res.status(404).json({
                message : "Chat not Found"
            });
        }
        chat.topic = topic.trim();
        await chat.save();

        return res.status(200).json({
            message : "Chat Updated",
            chat
        });
    } catch (error) {
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}