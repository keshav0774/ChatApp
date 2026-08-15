import User from "../models/userSchema.js";
import Chat from "../models/chatSchema.js";
import Message from "../models/messageSchema.js";
import { generateAIResponse } from "../services/openRouterService.js";
import { buildMessageForAI } from "../utlis/chatContext.js";
import {resetUsageIfNeeded, hasTokenLimitReached, addUserTokenUsage} from '../utlis/userUsage.js'
import { updateSummaryIfNeeded } from "../services/summaryService.js";
import { addChatTokenUsage } from "../utlis/tokenUsage.js";




export const getMessage = async(req,res)=>{
    try {
        const {chatId} = req.params;

        const chat = await Chat.findOne({
            _id : chatId,
            userId : req.user._id
        });
        const message = await Message.find(({
            chatId : chatId, 
            userId : req.user._id
        })).sort({createdAt:1});

        if(!chatId || !chat || !message){
            return res.status(403).json({
                message : "Chat not found Something Wrong"
            });
        }

        return res.status(200).json({
            message : "Chat are found",
            msg  : message
        });
    } catch (error) {
        return res.status(500).json({
            message : error.message
        })
    }
}

export const sendMessage = async(req,res)=>{ 
    try {
        console.log("send message hit");
        const {chatId} = req.params;
        const {content , model} = req.body ; 

        if(!content || content.trim() === ""){
            return res.status(400).json({
                message : "Send the Message please"
            })
        }
        
        // check user token limit 
        await resetUsageIfNeeded(req.user);
        // if token limit is reached 
        if(hasTokenLimitReached(req.user)){
           return res.status(429).json({
            message : "Token limit reached. Please try after some time.",
            usage : req.user.usage
           });
        }

        let chat;

        if(chatId){

            chat = await Chat.findOne({
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
                    message : " model is required for new chat"
                })
            }
            console.log("Api is calling")
             chat = await Chat.create({
                userId : req.user._id,
                model, 
                topic : content.trim().slice(0,40)
            })
            
        }

        
        const oldMessages = await Message.find({
            chatId : chat._id
        }).sort({createdAt : 1})
        .skip(chat.summarizedTillMessageNumber);


        const messageForAI = await buildMessageForAI({
            chat,
            oldMessages,
            currentMessage : content.trim() 
        });
        console.dir(messageForAI, { depth: null });
        const {aiReply, usage} = await generateAIResponse({
            model : chat.model,
            messages : messageForAI,
        });
        console.log('ai reply' , aiReply);
        const userMessage = await Message.create({
            chatId : chat._id,
            role : "user",
            content : content.trim(), 
            userId : req.user._id,
            usage,
        });
        
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

        await addChatTokenUsage(chat, usage);
        await addUserTokenUsage(req.user, usage.totalTokens);
        await chat.save();
    res.status(200).json({
        message : "Message sent successfully",
        chatId : chat._id, 
        reply : aiReply,
        usage,
        userMessage,
        assistantMessage
    })
   await updateSummaryIfNeeded(chat._id); 
        
} catch (error) {
    console.log("ERROR from message controllers",error)
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

export const reGenrate = async(req,res)=>{
    try {
        const {chatId} = req.params;
        console.log("regenerate is hit");
        const chat = await Chat.findOne({
                _id : chatId,
                userId : req.user._id
        }); 
        
        if(!chatId || !chat){
            return res.status(404).json({
                message : "Chat not found"
            })
        }

        await resetUsageIfNeeded(req.user);
        // if token limit is reached 
        if(hasTokenLimitReached(req.user)){
           return res.status(429).json({
            message : "Token limit reached. Please try after some time.",
            usage : req.user.usage
           });
        }

        const messages = await Message.find({
            chatId : chat._id,
            userId : req.user._id
        }).sort({createdAt : -1});
        
        const userMessage = messages[1];

        const assistantMessage = messages[0];

        if(!userMessage || !assistantMessage){
            return res.status(404).json({
                message : "We can't fetch the messages"
            })
        }

        const oldMessages = messages.slice(2).reverse();

        const messageForAI = buildMessageForAI({
            chat,
            oldMessages,
            currentMessage: userMessage.content + 'Please generate a fresh alternative response. Do not repeat the previous response.'
        });

        const { aiReply, usage } = await generateAIResponse({
              model: chat.model,
              messages: messageForAI
        });
         
        assistantMessage.content = aiReply;
        assistantMessage.usage = usage;

        chat.messageCount += 2;

        await addChatTokenUsage(chat, usage);
        await addUserTokenUsage(req.user, usage.totalTokens);
        await chat.save();
        
        res.status(200).json({
        message : "Message sent successfully",
        chatId : chat._id, 
        reply : aiReply,
        usage,
        userMessage,
        assistantMessage
       })

    } catch (error) {
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}