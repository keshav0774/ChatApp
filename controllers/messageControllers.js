import User from "../models/userSchema.js";
import Chat from "../models/chatSchema.js";
import Message from "../models/messageSchema.js";


export const getMessage = async(req,res)=>{
    try {
        const {chatId} = req.params;

        const chat = await Chat.findOne({
            _id : chatId,
            userId : req.user._id
        })
        const message = await Message.findOne(({
            chatId : chatId, 
            userId : req.user._id
        })).sort({createdAt:1}) 

        if(!chatID || !chat || !message){
            return res.status(403).json({
                message : "Chat not found Something Wrong"
            })
        }

        return res.status(200).json({
            message : "Chat are foun",
            msg  : message
        })
    } catch (error) {
        return res.status(500).json({
            message : error.message
        })
    }
}

export const sendMessage = async(req,res)=>{
    try {
        const {ChatId} = req.params;
        const {content , model} = req.body ; 

        if(!content || content.trim() === ""){
            return res.status(400).json({
                message : "Send the Message please"
            })
        }

        if(ChatId){

            const chat = await Chat.findOne({
                _id : chatId,
                userId : req.user._id
            }); 

            if(!chat){
                return res.status(403).json({
                    message : "Chat not found"
                })
            }
        }
        else {
            if(!model){
                return res.status(400).json({
                    message : " model is required"
                })
            }

            const chat = await Chat.create({
                userId : req.userId,
                model, 
                topic : content.trim().slice(0,40)
            })
            
        }

        const userMessage = await Message.create({
            userId : req.user._id,
            chatId : chat._id,
            role : "assistant",
            content : aiReply

        })
        const aiReply = "AI reply will come here later.";

        const assistantMessage = await Message.create({
         chatId: chat._id,
         role: "assistant",
         content: aiReply,
          userId: req.user._id
         });
        chat.messageCount += 2;

        if (chat.topic === "New Chat") {
      chat.topic = content.trim().slice(0, 40);
    }

    return res.status(200).json({
        message : "Ai reply",
        chatId : chat._id, 
        userMessage,
        assistantMessage
    })

        
    } catch (error) {
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}