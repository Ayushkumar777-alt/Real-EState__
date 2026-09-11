import { useState } from 'react'
import { Heart, MapPin } from 'lucide-react'
import type { RecommendedProperty } from '../types/property'
import { formatPrice, formatBhk } from '../lib/format'
import { isPropertySaved, toggleSavedProperty } from '../lib/savedProperties'

interface PropertyCardProps {
  property: RecommendedProperty
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [saved, setSaved] = useState(() => isPropertySaved(property.id))

  function handleToggleSave(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setSaved(toggleSavedProperty(property))
  }

  const badges = [formatBhk(property.bhk), property.type].filter(Boolean)
  const visibleAmenities = property.amenities.slice(0, 3)
  const extraAmenities = property.amenities.length - visibleAmenities.length

  return (
    <div className="liquid-glass border border-white/10 rounded-xl overflow-hidden hover:border-white/30 transition-colors group">
      <div className="relative h-48">
        {/* Side-scrolling image strip - swipe/scroll sideways through all photos */}
        <div className="flex h-full overflow-x-auto snap-x snap-mandatory scrollbar-none">
          {property.images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`${property.title} photo ${i + 1}`}
              className="w-full h-full object-cover flex-none snap-center"
            />
          ))}
        </div>

        {property.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {property.images.map((_, i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-full bg-white/70" />
            ))}
          </div>
        )}

        {property.matchReason && (
          <span className="absolute top-3 left-3 bg-white text-black text-xs font-medium px-3 py-1 rounded-full max-w-[calc(100%-2.5rem)] truncate">
            {property.matchReason}
          </span>
        )}

        <button
          onClick={handleToggleSave}
          aria-label={saved ? 'Remove from saved' : 'Save property'}
          className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm p-2 rounded-full hover:bg-black/60 transition-colors"
        >
          <Heart
            size={16}
            className={saved ? 'fill-white text-white' : 'text-white'}
          />
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-medium text-white">{property.title}</h3>
          <span className="text-sm font-semibold text-white whitespace-nowrap">
            {formatPrice(property.price)}
          </span>
        </div>

        <div className="flex items-center gap-1 text-gray-400 text-sm mb-3">
          <MapPin size={14} />
          {property.locality}, {property.city}
        </div>

        <div className="flex flex-wrap gap-2">
          {badges.map((badge) => (
            <span
              key={badge}
              className="text-xs text-gray-200 bg-white/10 rounded-full px-2.5 py-1"
            >
              {badge}
            </span>
          ))}
          {visibleAmenities.map((tag) => (
            <span
              key={tag}
              className="text-xs text-gray-300 border border-white/15 rounded-full px-2.5 py-1"
            >
              {tag}
            </span>
          ))}
          {extraAmenities > 0 && (
            <span className="text-xs text-gray-400 px-1 py-1">
              +{extraAmenities} more
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
