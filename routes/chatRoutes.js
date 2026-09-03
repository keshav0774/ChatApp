import express from 'express'; 
import { getAllFavChat , markAsFavChat, getRecentChat, getChatById, deleteChat, newChat,searchChat, renameChat} from '../controllers/chatController.js';
import { authmiddleWare } from '../middleware/userMiddleware.js';
import { authenticateRatelimiter } from '../ratelimiter/rateLimiter.js';
const chatRouter = express.Router(); 

chatRouter.use(authmiddleWare);
chatRouter.use(authenticateRatelimiter); 

chatRouter.post('/new-chat', newChat);
chatRouter.get('/recent', getRecentChat);


chatRouter.get('/favorites', getAllFavChat);
chatRouter.get('/search', searchChat);

chatRouter.get('/:chatId', getChatById);
chatRouter.patch('/:chatId/rename', renameChat);
chatRouter.patch('/:chatId', markAsFavChat);
chatRouter.delete('/deleteChat/:chatId' ,deleteChat);

export default chatRouter;