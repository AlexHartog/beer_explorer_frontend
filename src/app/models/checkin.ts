import { Beer } from './beer';

export interface Checkin {
    userId: number
    beer: Beer 
    date: Date
    rating: number
    created_at: Date
}

export interface CreateCheckin {
    userId: number
    beerId: number 
    date: Date
    rating?: number
}