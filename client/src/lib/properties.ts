import { apiFetch } from './api'
import type { Property } from '../types/property'

export async function fetchSampleProperties(): Promise<Property[]> {
  return apiFetch('/sample-properties')
}
