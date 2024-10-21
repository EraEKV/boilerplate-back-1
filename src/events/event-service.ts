import mongoose from 'mongoose';
import { CreateEventDto } from './dtos/CreateEvent.dot';
import EventModel, { IEvent } from './models/Event';



class EventService {
  
  async getEventById(id: string): Promise<IEvent | null> {
    return await EventModel.findById(id).exec();
  }
  
  async getEventsByCity(city : string): Promise<IEvent[]> {
    return await EventModel.find({"location" : city}).exec()
  }

  async getEvents(page: number, limit: number, sortByRating: string, sortByDirection: string ): Promise<IEvent[]> {
    const sortCriteria = {};
    sortCriteria[sortByRating] = sortByDirection === 'asc'? 1 : -1;

    return await EventModel.find().sort(sortCriteria).skip((page - 1) * limit).limit(limit).exec(); 
  }

  async createEvent(createEventDto: CreateEventDto): Promise<IEvent> {
    const { name, description, date, location , duration, rating} = createEventDto;
    const newEvent = new EventModel({
      name,
      description,
      date: new Date(date),
      location,
      duration,
      rating
    });

    await newEvent.save();
    return newEvent;
  }
}

export default EventService;
  