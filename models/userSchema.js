import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
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
    isSubscription:{
        type : Boolean,
        default: false
    },
    subscriptionPlan:{
        type:String,
        enum:['free','pro','enterprise'],
        default : 'free',
    },
   
    tokenLimit:{
        type: Number,
        default : 200000
    },
    lastLogin:{
        type : Number,
        default :Date.now
    },
    lastLogout :{
        type : Number,
        default :  Date.now,
    },
    usage:{
        tokenUsed:{
            type:Number,
            default :0
        },
        reSetAt:{
         type:Number,
            default :()=> new Date(Date.now() + 5*1000*60*60) // reset after 5 Hours
        },
        totalTokenUsed:{
            type : Number,
            default:0
        }
    }
},{timestamps:true});

const User = mongoose.model('User',userSchema);

export default User;