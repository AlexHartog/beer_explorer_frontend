import { Beer } from './beer';
import { User } from './user'

export interface Checkin {
    user: User
    beer: Beer 
    date: Date
    rating: number
    in_bar: boolean
    created_at: Date
}

export interface CreateCheckin {
    userId: number
    beerId: number 
    date: Date
    in_bar: boolean
    rating?: number
}