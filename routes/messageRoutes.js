import express from 'express'; 
import { authmiddleWare } from '../middleware/userMiddleware.js';
import { sendMessage, getMessage } from '../controllers/messageControllers.js';


const messageRouter = express.Router(); 

messageRouter.use(authmiddleWare);
console.log("api is calling")
messageRouter.post('/',sendMessage);
messageRouter.get('/:chatId', getMessage);
messageRouter.post('/:chatId', sendMessage);

export default messageRouter;