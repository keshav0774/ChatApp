import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    userId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    chatName:{
        type :String,
        required : true,
        default : "New Chat"
    },
    model : {
        type :String,
        required : true,
    },
    summary:{
        type : String, 
        default : ""
    },
    summaryUpdated :{
        type : Number,
        default : null
    },
    summarizedTillMessageNumber: {
    type: Number,
    default: 0
    },
    isFavorite :{
        type : Boolean,
        default : false
    },
    isArchived : {
        type : Boolean,
        default : false
    },
    usage: {
    promptTokens: {
      type: Number,
      default: 0
    },

    completionTokens: {
      type: Number,
      default: 0
    },

    totalTokens: {
      type: Number,
      default: 0
    }
  }
},{timestamps : true})

chatSchema.index({ userId: 1, updatedAt: -1 });

const Chat = mongoose.model('Chat',chatSchema);

export default Chat;