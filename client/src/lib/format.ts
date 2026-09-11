export function formatPrice(price: number): string {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(price % 10000000 === 0 ? 0 : 1)} Cr`
  }
  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(price % 100000 === 0 ? 0 : 1)} L`
  }
  return `₹${price.toLocaleString('en-IN')}`
}

export function formatBhk(bhk: number | null): string {
  return bhk ? `${bhk} BHK` : ''
}
