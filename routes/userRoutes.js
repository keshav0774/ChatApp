import express from 'express';
import { authmiddleWare } from '../middleware/userMiddleware.js';
import { signup,login,logout,profile,deleteAcount } from '../controllers/userControllers.js';
const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/login',login);
userRouter.post('/logout',logout);
userRouter.get('/profile',authmiddleWare,profile);
userRouter.post('/delete',authmiddleWare,deleteAcount);

export default userRouter;