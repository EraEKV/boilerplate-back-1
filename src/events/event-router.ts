import { Router } from 'express';
import EventController from './event-controller';
import EventService from './event-service';
import { authMiddleware } from '../middlewares/auth-middleware';

const eventRouter = Router();

const eventService = new EventService();
const eventController = new EventController(eventService);

eventRouter.get('/events/', eventController.getEvents);
eventRouter.post('/events/', eventController.createEvent); 
eventRouter.get('/events/:id', eventController.getEventById) 

eventRouter.get('/events/user', authMiddleware, eventController.getEventsByCity);

export default eventRouter;
