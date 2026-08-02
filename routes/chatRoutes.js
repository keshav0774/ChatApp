import express from 'express'; 
import { getAllFavChat , markAsFavChat, getRecentChat, getChatById, deleteChat, newChat} from '../controllers/chatController.js';
import { authmiddleWare } from '../middleware/userMiddleware.js';

const chatRouter = express.Router(); 

chatRouter.use(authmiddleWare);

chatRouter.post('/new-chat', newChat);
chatRouter.get('/recent', getRecentChat);
chatRouter.get('/:chatId', getChatById);
chatRouter.delete('/deleteChat/:chatId' ,deleteChat);
chatRouter.patch('/:chatId', markAsFavChat);
chatRouter.get('/favorites', getAllFavChat);

export default chatRouter;