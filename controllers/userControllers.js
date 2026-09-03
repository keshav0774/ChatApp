import User from "../models/userSchema.js";
import Chat from "../models/chatSchema.js";
import Message from "../models/messageSchema.js";
import bcrypt from 'bcrypt';
import cookieParser from "cookie-parser";
import { signupSchema,loginSchema } from "../validator/validator.js";
import jwt from 'jsonwebtoken';

export const signup = async(req,res)=>{
   try {

    const result = signupSchema.safeParse(req.body);
    if(!result){
        return res.status(400).json({
                message: result.error.issues[0].message
            })
    }
    const {name, email , password} = result.data;

    const checkUser = await User.findOne({email : email});
    if(checkUser){
        return res.status(409).json({message : "User already Exist with this mail"});
    }
    const hashPassword = await bcrypt.hash(password,12);
    const user = await User.create({
        name : name, email : email , password : hashPassword
    });
    const reply = {
        name : user.name,
        userId : user._id,
        email : user.email,
    };

    const token = jwt.sign(
    {_id : user._id, email : user.email },
    process.env.JWT_SECRET,
    {expiresIn : process.env.JWT_EXPIRES_IN }
    );
    res.cookie('token',token,{
        httpOnly:true,
        secure: process.env.NODE_ENV === "production",
        path : '/'
    });
    
    return res.status(201).json({
        user : reply,
        message : "User Created SuccessFully",
       
    })

   } catch (err) {
      res.json({
        message : err.message,
      })
   }
};

export const login = async(req,res)=>{
   try {
      
    const result = loginSchema.safeParse(req.body);
    if(!result.success){
        return res.status(400).json({
            message : result.error.issues[0].message
        })
    }
    
    
    const {email , password} = result.data; 
    const user = await User.findOne({ email });
        if(!user){
        return res.status(401).json({message : "Invalid Credential"});
        }
          const reply = {
          name:user.name,
          userId:user._id,
          email:user.email
        }
    const hassPassword = await bcrypt.compare(password,user.password);
    if(!hassPassword){
        return res.json({message : "Invalid Credential"})
    }
    const token = jwt.sign(
    {_id : user._id, email : user.email },
    process.env.JWT_SECRET,
    {expiresIn : process.env.JWT_EXPIRES_IN }
    );
    res.cookie('token',token,{
        httpOnly:true,
       secure: process.env.NODE_ENV === "production",
       path : '/'
    });
    
    return res.status(200).json({
        user : reply,
        message : "User Login SuccessFully",
      
    })
    
   } catch (err) {
 
      return res.status(500).json({
            message:err.message})
   }

       
};

export const logout = async(req,res)=>{
    try {
      
       
        res.clearCookie("token", {
         httpOnly:true,
         secure: process.env.NODE_ENV === "production",
         path : '/'
        }
        );
       return  res.status(200).json({
            message :"Logges Out Successfully",
        })
    } catch (err) {
        return res.status(500).json({
            error : err.message
        })
    }
};

export const profile = async (req,res)=>{
      try {
        const user = req.user; 
        
        
        const reply = {
          name:user.name,
         userId:user._id,
        email:user.email
        }
        res.status(200).json({
            message: "here is your profile",
            user : reply
        })
      } catch (error) {
        res.status(400).json({
            error : error.message,
        })
      }
};



export const deleteAcount = async(req,res)=>{
    try {
        const userID = req.user._id; 

        await Message.deleteMany({userId});
        await Chat.deleteMany({userId});
        await User.deleteOne({_id : userID});

        res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      path : '/'
    });
    return res.status(200).json("User deleted Successfully");

    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const update = async(req,res)=>{
    try {
        const {name , email } = req.body; 
        
        const updateField = {}; 
        if(name !== undefined) updateField.name = name;
        if(email !== undefined) updateField.email = email;

        const user = await User.findByIdAndUpdate({_id : req.user._id}, updateField, {new : true});

        if(!user) {
            return res.status(404).json({
                message : "Something went wrong"
            })
        }

        return res.status(200).json({
            message : "User update Successfully",
            user
        })
    } catch (error) {
        return res.status(500).json({
            message : "Internal Server Error",

        })
    }
}