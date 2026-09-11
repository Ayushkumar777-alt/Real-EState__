import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  SlidersHorizontal,
  Sparkles,
  SearchX,
  MapPin,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PropertyCard from '../components/PropertyCard'
import { apiFetch } from '../lib/api'
import { fetchSampleProperties } from '../lib/properties'
import type { Property, RecommendedProperty } from '../types/property'

const PROPERTY_TYPES = ['Any', 'Apartment', 'Villa', 'Studio', 'Commercial', 'Plot']
const BHK_OPTIONS = ['Any', '1', '2', '3', '4+']
const FURNISHING_OPTIONS = ['Any', 'Unfurnished', 'Semi-Furnished', 'Furnished']
const AMENITIES = [
  'Parking',
  'Lift',
  'Swimming Pool',
  'Gym',
  'Security',
  'Garden',
  'Pet Friendly',
  'School Nearby',
  'Hospital Nearby',
  'Metro Nearby',
]

type Tab = 'browse' | 'ai'

interface BrowseFilters {
  query: string
  city: string
  type: string
  bhk: string
  minPrice: string
  maxPrice: string
  furnishing: string
  amenities: string[]
}

const EMPTY_FILTERS: BrowseFilters = {
  query: '',
  city: '',
  type: 'Any',
  bhk: 'Any',
  minPrice: '',
  maxPrice: '',
  furnishing: 'Any',
  amenities: [],
}

interface AiPreferences {
  budget: string
  city: string
  locality: string
  propertyType: string
  bhk: string
  amenities: string[]
}

const EMPTY_AI: AiPreferences = {
  budget: '',
  city: '',
  locality: '',
  propertyType: 'Any',
  bhk: 'Any',
  amenities: [],
}

export default function SearchRecommend() {
  const [searchParams] = useSearchParams()
  const [tab, setTab] = useState<Tab>(searchParams.get('tab') === 'ai' ? 'ai' : 'browse')

  const [allProperties, setAllProperties] = useState<Property[]>([])
  const [loadingProperties, setLoadingProperties] = useState(true)

  const [draftFilters, setDraftFilters] = useState<BrowseFilters>({
    ...EMPTY_FILTERS,
    query: searchParams.get('q') || '',
  })
  const [appliedFilters, setAppliedFilters] = useState<BrowseFilters>(draftFilters)

  const [aiForm, setAiForm] = useState<AiPreferences>(EMPTY_AI)
  const [aiResults, setAiResults] = useState<RecommendedProperty[] | null>(null)
  const [aiSource, setAiSource] = useState<'ai' | 'fallback' | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')

  useEffect(() => {
    fetchSampleProperties()
      .then(setAllProperties)
      .catch(() => setAllProperties([]))
      .finally(() => setLoadingProperties(false))
  }, [])

  const filteredResults = useMemo(() => {
    return allProperties.filter((p) => {
      const f = appliedFilters
      if (f.query) {
        const haystack = `${p.title} ${p.city} ${p.locality}`.toLowerCase()
        if (!haystack.includes(f.query.toLowerCase())) return false
      }
      if (f.city && !p.city.toLowerCase().includes(f.city.toLowerCase())) return false
      if (f.type !== 'Any' && p.type !== f.type) return false
      if (f.bhk !== 'Any') {
        if (f.bhk === '4+') {
          if (!p.bhk || p.bhk < 4) return false
        } else if (p.bhk !== Number(f.bhk)) {
          return false
        }
      }
      if (f.minPrice && p.price < Number(f.minPrice)) return false
      if (f.maxPrice && p.price > Number(f.maxPrice)) return false
      if (f.furnishing !== 'Any' && p.furnishing !== f.furnishing) return false
      if (f.amenities.length > 0 && !f.amenities.every((a) => p.amenities.includes(a))) {
        return false
      }
      return true
    })
  }, [allProperties, appliedFilters])

  function toggleDraftAmenity(amenity: string) {
    setDraftFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }))
  }

  function toggleAiAmenity(amenity: string) {
    setAiForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }))
  }

  function handleApplyFilters(e: React.FormEvent) {
    e.preventDefault()
    setAppliedFilters(draftFilters)
  }

  async function handleGetRecommendations(e: React.FormEvent) {
    e.preventDefault()
    setAiError('')
    setAiLoading(true)
    setAiResults(null)
    setAiSource(null)

    try {
      const data = await apiFetch('/recommend', {
        method: 'POST',
        body: JSON.stringify(aiForm),
      })
      setAiResults(data.results)
      setAiSource(data.source)
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 px-6 md:px-12 lg:px-16 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-normal" style={{ letterSpacing: '-0.03em' }}>
            Find Your Property
          </h1>

          <div className="liquid-glass border border-white/15 rounded-lg p-1 flex w-fit">
            <button
              onClick={() => setTab('browse')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                tab === 'browse' ? 'bg-white text-black' : 'text-gray-300 hover:text-white'
              }`}
            >
              <SlidersHorizontal size={15} />
              Browse & Filter
            </button>
            <button
              onClick={() => setTab('ai')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                tab === 'ai' ? 'bg-white text-black' : 'text-gray-300 hover:text-white'
              }`}
            >
              <Sparkles size={15} />
              AI Recommend
            </button>
          </div>
        </div>

        {tab === 'browse' ? (
          <div className="grid lg:grid-cols-[300px_1fr] gap-8">
            <form
              onSubmit={handleApplyFilters}
              className="liquid-glass border border-white/15 rounded-xl p-5 flex flex-col gap-4 h-fit"
            >
              <input
                type="text"
                value={draftFilters.query}
                onChange={(e) => setDraftFilters({ ...draftFilters, query: e.target.value })}
                placeholder="Search by name, city..."
                className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-white/50 transition-colors placeholder:text-gray-500"
              />
              <input
                type="text"
                value={draftFilters.city}
                onChange={(e) => setDraftFilters({ ...draftFilters, city: e.target.value })}
                placeholder="City"
                className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-white/50 transition-colors placeholder:text-gray-500"
              />
              <select
                value={draftFilters.type}
                onChange={(e) => setDraftFilters({ ...draftFilters, type: e.target.value })}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-sm outline-none"
              >
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t} className="bg-black">
                    {t === 'Any' ? 'Any Property Type' : t}
                  </option>
                ))}
              </select>
              <select
                value={draftFilters.bhk}
                onChange={(e) => setDraftFilters({ ...draftFilters, bhk: e.target.value })}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-sm outline-none"
              >
                {BHK_OPTIONS.map((b) => (
                  <option key={b} value={b} className="bg-black">
                    {b === 'Any' ? 'Any BHK' : `${b} BHK`}
                  </option>
                ))}
              </select>
              <div className="flex gap-3">
                <input
                  type="number"
                  value={draftFilters.minPrice}
                  onChange={(e) => setDraftFilters({ ...draftFilters, minPrice: e.target.value })}
                  placeholder="Min ₹"
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-sm outline-none placeholder:text-gray-500"
                />
                <input
                  type="number"
                  value={draftFilters.maxPrice}
                  onChange={(e) => setDraftFilters({ ...draftFilters, maxPrice: e.target.value })}
                  placeholder="Max ₹"
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-sm outline-none placeholder:text-gray-500"
                />
              </div>
              <select
                value={draftFilters.furnishing}
                onChange={(e) => setDraftFilters({ ...draftFilters, furnishing: e.target.value })}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-sm outline-none"
              >
                {FURNISHING_OPTIONS.map((f) => (
                  <option key={f} value={f} className="bg-black">
                    {f === 'Any' ? 'Any Furnishing' : f}
                  </option>
                ))}
              </select>

              <div>
                <p className="text-sm font-medium mb-2">Amenities</p>
                <div className="grid grid-cols-2 gap-x-2 gap-y-2">
                  {AMENITIES.map((amenity) => (
                    <label
                      key={amenity}
                      className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={draftFilters.amenities.includes(amenity)}
                        onChange={() => toggleDraftAmenity(amenity)}
                        className="w-3.5 h-3.5 accent-white"
                      />
                      {amenity}
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="bg-white text-black py-2.5 rounded-lg font-medium hover:bg-gray-100 transition-colors mt-1"
              >
                Apply Filters
              </button>
            </form>

            <div>
              {loadingProperties ? (
                <p className="text-gray-400 text-sm">Loading properties...</p>
              ) : filteredResults.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-24">
                  <SearchX size={28} className="text-gray-500 mb-3" />
                  <p className="text-gray-400">
                    No properties matched your filters. Try broadening your search.
                  </p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredResults.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center mb-8">
              <Sparkles size={22} className="mx-auto mb-2 text-white" />
              <p className="text-gray-400 text-sm max-w-xl mx-auto">
                Tell us what matters most — Groq AI reads your preferences against
                our sample listings and picks your Top 5, with a local weighted
                engine as backup if AI is unavailable.
              </p>
            </div>

            <form
              onSubmit={handleGetRecommendations}
              className="liquid-glass border border-white/15 rounded-xl p-6 max-w-3xl mx-auto flex flex-col gap-5 mb-10"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-gray-300 mb-1.5">Budget (₹)</label>
                  <input
                    type="number"
                    value={aiForm.budget}
                    onChange={(e) => setAiForm({ ...aiForm, budget: e.target.value })}
                    placeholder="e.g. 7500000"
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-white/50 transition-colors placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1.5">City</label>
                  <input
                    type="text"
                    value={aiForm.city}
                    onChange={(e) => setAiForm({ ...aiForm, city: e.target.value })}
                    placeholder="e.g. Bengaluru"
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-white/50 transition-colors placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1.5">
                    Locality (optional)
                  </label>
                  <input
                    type="text"
                    value={aiForm.locality}
                    onChange={(e) => setAiForm({ ...aiForm, locality: e.target.value })}
                    placeholder="e.g. Whitefield"
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-white/50 transition-colors placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1.5">Property Type</label>
                  <select
                    value={aiForm.propertyType}
                    onChange={(e) => setAiForm({ ...aiForm, propertyType: e.target.value })}
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-sm outline-none"
                  >
                    {PROPERTY_TYPES.map((t) => (
                      <option key={t} value={t} className="bg-black">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1.5">Bedrooms (BHK)</label>
                  <select
                    value={aiForm.bhk}
                    onChange={(e) => setAiForm({ ...aiForm, bhk: e.target.value })}
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-sm outline-none"
                  >
                    {BHK_OPTIONS.map((b) => (
                      <option key={b} value={b} className="bg-black">
                        {b === 'Any' ? 'Any' : `${b} BHK`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-300 mb-2">Preferred Amenities</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
                  {AMENITIES.map((amenity) => (
                    <label
                      key={amenity}
                      className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={aiForm.amenities.includes(amenity)}
                        onChange={() => toggleAiAmenity(amenity)}
                        className="w-4 h-4 accent-white"
                      />
                      {amenity}
                    </label>
                  ))}
                </div>
              </div>

              {aiError && <p className="text-red-400 text-sm">{aiError}</p>}

              <button
                type="submit"
                disabled={aiLoading}
                className="bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-60"
              >
                {aiLoading ? 'Finding matches...' : 'Get AI Recommendations'}
              </button>
            </form>

            {aiResults && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin size={15} className="text-gray-400" />
                  <p className="text-sm text-gray-400">
                    {aiSource === 'ai'
                      ? 'Powered by Groq AI'
                      : 'Matched using our local scoring engine (Groq unavailable)'}
                  </p>
                </div>

                {aiResults.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-16">
                    <SearchX size={28} className="text-gray-500 mb-3" />
                    <p className="text-gray-400 max-w-sm">
                      No properties matched in this area yet. Try widening your
                      budget or checking a nearby city.
                    </p>
                  </div>
                ) : (
                  <div className="flex gap-6 overflow-x-auto pb-2 snap-x snap-mandatory">
                    {aiResults.map((property) => (
                      <div key={property.id} className="w-[300px] flex-none snap-start">
                        <PropertyCard property={property} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
