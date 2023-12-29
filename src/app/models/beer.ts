export interface Brand {
    name: string
}

export interface BeerType {
    name: string
}

export interface User {
    name: string
}

export interface Beer {
    name: string,
    brand: Brand,
    type: BeerType
}

export interface BeerCheckin {
    user: User
    date: Date
    beer: Beer 
}

