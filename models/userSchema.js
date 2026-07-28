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
        type: Number,
        default : 200000
    },
    usage:{
        tokenUsed:{
            type:Number,
            default :0
        }
    },
    reSetAt:{
    typee:Number,
    default :()=> new Date(Date.now() + 5*1000*60*60) // reset after 5 Hours
    }
},{timestamps:true});

const userSchema = mongoose.model('User',userSchema);

export default userSchema;