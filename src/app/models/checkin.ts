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

export function dateEquals(checkin: Checkin, date: Date) {
    if (date == null) {
        return false;
    }
    const dateCheckin = new Date(checkin.date);
    const dateToCompare = new Date(date);
    dateCheckin.setHours(0,0,0,0);
    dateToCompare.setHours(0,0,0,0);

    return dateCheckin.getTime() === dateToCompare.getTime()
}