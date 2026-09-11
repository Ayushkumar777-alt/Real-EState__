import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PropertyCard from '../components/PropertyCard'
import { getSavedProperties } from '../lib/savedProperties'
import type { Property } from '../types/property'

export default function Saved() {
  const [saved, setSaved] = useState<Property[]>([])

  useEffect(() => {
    setSaved(getSavedProperties())
  }, [])

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 px-6 md:px-12 lg:px-16 py-12">
        {saved.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-24">
            <div className="liquid-glass border border-white/15 rounded-full p-4 mb-4">
              <Heart size={24} />
            </div>
            <h1 className="text-2xl font-normal mb-2">
              No saved properties yet
            </h1>
            <p className="text-gray-400 text-sm max-w-sm">
              Properties you save while browsing will show up here — stored
              right in your browser, so they stay even if you're offline.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl md:text-3xl font-normal mb-1">
              Saved properties
            </h2>
            <p className="text-gray-400 text-sm mb-8">
              Stored locally in your browser, so they're here even offline.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {saved.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  )
}
