import mongoose from "mongoose";


const user = new mongoose.Schema({
    name:{
        type :String,
        required:true,
        maxLen :20
    },
    email:{
        type : String,
        required: true, 
        unique: true
    },
    age:{
        type:Number,
    },
    password:{
        type : String,
        required : true,
    },
    tokenLimit:{
        type: 
    }
},{timestamps:true})