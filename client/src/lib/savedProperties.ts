import type { Property } from '../types/property'

const KEY = 'vex_saved_properties'

// Everything here reads/writes localStorage directly, which lives in the
// browser itself - so saved properties are still there even with no
// internet connection or before the backend is wired up to serve them.

export function getSavedProperties(): Property[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function isPropertySaved(id: string): boolean {
  return getSavedProperties().some((p) => p.id === id)
}

// Returns the new saved state (true = now saved, false = now removed)
export function toggleSavedProperty(property: Property): boolean {
  const saved = getSavedProperties()
  const exists = saved.some((p) => p.id === property.id)
  const next = exists
    ? saved.filter((p) => p.id !== property.id)
    : [...saved, property]

  localStorage.setItem(KEY, JSON.stringify(next))
  return !exists
}
