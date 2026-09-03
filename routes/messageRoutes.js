import express from 'express'; 
import { authmiddleWare } from '../middleware/userMiddleware.js';
import { sendMessage, getMessage ,reGenrate} from '../controllers/messageControllers.js';
import { authenticateRatelimiter } from '../ratelimiter/rateLimiter.js';

const messageRouter = express.Router(); 

messageRouter.use(authmiddleWare);
messageRouter.use(authenticateRatelimiter);

messageRouter.post('/',sendMessage);
messageRouter.get('/:chatId', getMessage);
messageRouter.post('/:chatId', sendMessage);
messageRouter.post('/:chatId/regenerate', reGenrate);

export default messageRouter;