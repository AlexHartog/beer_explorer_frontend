import { Beer } from './beer';

export interface Checkin {
    userId: number
    beer: Beer 
    date: Date
    rating: number
}

export interface CreateCheckin {
    userId: number
    beerId: number 
    date: Date
    rating?: number
}