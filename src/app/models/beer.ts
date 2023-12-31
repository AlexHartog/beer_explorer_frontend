export interface Brand {
    name: string
}

export interface BeerType {
    name: string
}

export interface Beer {
    id?: number,
    name: string,
    brand: Brand,
    type: BeerType
    percentage: number,
}

export function beersEqual(beer1: Beer, beer2: Beer): boolean {
    // if (beer1.brand.name?.toLowerCase() == "amstel" && beer1.type.name?.toLowerCase() == "blond") {
    //     console.log("Comparing ", beer1, " to ", beer2)
    // }
    return beer1.name?.toLowerCase() === beer2.name?.toLowerCase() &&
        beer1.brand.name.toLowerCase() === beer2.brand.name.toLowerCase() && 
        beer1.type.name.toLowerCase() === beer2.type.name.toLowerCase(); 
}

