import express from 'express'; 
import { authmiddleWare } from '../middleware/userMiddleware.js';
import { sendMessage, getMessage ,reGenrate} from '../controllers/messageControllers.js';


const messageRouter = express.Router(); 

messageRouter.use(authmiddleWare);
console.log("api is calling")
messageRouter.post('/',sendMessage);
messageRouter.get('/:chatId', getMessage);
messageRouter.post('/:chatId', sendMessage);
messageRouter.post('/:chatId/regenerate', reGenrate);

export default messageRouter;