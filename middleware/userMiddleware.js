import jwt from 'jsonwebtoken';
import User from '../models/userSchema.js';
import cookieParser from "cookie-parser";



export const authmiddleWare = async (req,res,next)=>{
    try {
        const { token } = req.cookies;
        if(!token){
            return res.status(403).json({
                message : "token not fount"
            })
        }
        const payload = jwt.verify(token, process.env.JWT_SECRET); 

        const userId = payload._id;
        if(!userId){
            return res.status(404).json({
                message : "userid not found"
            })
        }
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({message : "user not found"});

        req.user = user;
        next();
        
    } catch (error) {
        res.status(401).json({
            message : "Can't Authenticate"
        })
    }
}