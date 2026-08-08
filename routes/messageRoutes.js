import express from 'express'; 
import { authmiddleWare } from '../middleware/userMiddleware.js';



const messageRouter = express.Router(); 

messageRouter.use(authmiddleWare);

messageRouter.post('/',sendMessage);
messageRouter.get('/:chatId', getMessage);
messageRouter.post('/:chatId', sendMessage);

export default messageRouter;