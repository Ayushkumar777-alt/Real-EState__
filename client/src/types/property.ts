export type PropertyType = 'Apartment' | 'Villa' | 'Studio' | 'Commercial' | 'Plot'
export type Furnishing = 'Unfurnished' | 'Semi-Furnished' | 'Furnished'

export interface Property {
  id: string
  title: string
  city: string
  locality: string
  type: PropertyType
  bhk: number | null // null for Commercial/Plot, which aren't measured in bedrooms
  price: number // plain rupee amount, e.g. 8500000 - formatted for display with formatPrice()
  furnishing: Furnishing
  amenities: string[]
  images: string[] // one or more - PropertyCard renders these as a side-scrolling strip
}

// Attached to a Property once it comes back from the recommendation engine
export interface RecommendedProperty extends Property {
  matchReason?: string
}
