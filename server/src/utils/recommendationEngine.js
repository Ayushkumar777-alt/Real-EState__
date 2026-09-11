// A simple weighted scoring engine. This runs whenever Groq is unreachable
// or no GROQ_API_KEY is configured, so recommendations still work without AI.

export function scoreProperties(preferences, properties) {
  const { budget, city, locality, propertyType, bhk, amenities = [] } = preferences

  const scored = properties.map((property) => {
    let score = 0

    if (city && property.city.toLowerCase() === city.toLowerCase()) {
      score += 30
    }
    if (locality && property.locality.toLowerCase().includes(locality.toLowerCase())) {
      score += 15
    }
    if (propertyType && propertyType !== 'Any' && property.type === propertyType) {
      score += 20
    }
    if (bhk && property.bhk === Number(bhk)) {
      score += 15
    }
    if (budget) {
      const numericBudget = Number(budget)
      if (property.price <= numericBudget) {
        // Reward being close to (but under) budget, not just "cheap"
        const closeness = property.price / numericBudget
        score += 15 * closeness
      } else {
        // Mildly penalize going over budget instead of excluding outright,
        // so a near-miss still shows up rather than nothing at all
        const overBy = (property.price - numericBudget) / numericBudget
        score -= Math.min(20, overBy * 20)
      }
    }
    if (amenities.length > 0) {
      const overlap = amenities.filter((a) => property.amenities.includes(a)).length
      score += (overlap / amenities.length) * 15
    }

    return { ...property, matchScore: Math.round(score) }
  })

  return scored
    .filter((p) => p.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
}
