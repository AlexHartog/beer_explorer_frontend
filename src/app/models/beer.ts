export interface Brand {
    name: string
}

export interface BeerType {
    name: string
}

export interface Beer {
    name: string,
    brand: Brand,
    type: BeerType
}

