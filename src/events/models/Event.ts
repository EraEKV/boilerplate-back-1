import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
    name: string;
    description: string;
    date: string;
    location: string;
    duration: string;
    rating?: number; 
}

const EventSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    date: { type: String, default: Date.now },
    location: { type: String, required: true },
    duration: { type: String, required: true },
    rating: { type: Number, default: 5 }
});

const Event = mongoose.model<IEvent>('Event', EventSchema);

export default Event;