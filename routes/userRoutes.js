import express from 'express';
import { authmiddleWare } from '../middleware/userMiddleware.js';
import { signup,login,logout,profile,deleteAcount,update } from '../controllers/userControllers.js';

import { unauthenticatedRatelimiter,authenticateRatelimiter } from '../ratelimiter/rateLimiter.js';

const userRouter = express.Router();

userRouter.post('/signup',unauthenticatedRatelimiter,signup);
userRouter.post('/login',unauthenticatedRatelimiter,login);
userRouter.post('/logout',authmiddleWare,authenticateRatelimiter,logout);
userRouter.get('/profile',authmiddleWare,profile);
userRouter.post('/delete',authmiddleWare,authenticateRatelimiter,deleteAcount);
userRouter.patch('/update',authmiddleWare, update);

export default userRouter;