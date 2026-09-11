import { useEffect, useState } from 'react'
import { Sparkles, ShieldCheck, Eye, MessagesSquare, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PropertyCard from '../components/PropertyCard'
import { fetchSampleProperties } from '../lib/properties'
import type { Property } from '../types/property'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4'

const FEATURES = [
  {
    icon: Sparkles,
    title: 'Smart Matching',
    description: 'Recommendations that learn from what you search and save.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified Listings',
    description: 'Every property is checked before it reaches your feed.',
  },
  {
    icon: Eye,
    title: 'Compare Without Visits',
    description: 'Detailed photos and info so you can shortlist from home.',
  },
  {
    icon: MessagesSquare,
    title: 'Direct Connect',
    description: 'Message owners or agents straight from a listing.',
  },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [properties, setProperties] = useState<Property[]>([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    fetchSampleProperties()
      .then(setProperties)
      .catch(() => setProperties([]))
  }, [])

  const recommended = properties.slice(0, 3)
  const trending = properties.slice(3, 6)

  function handleSearch() {
    navigate(`/search${query ? `?q=${encodeURIComponent(query)}` : ''}`)
  }

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero: static background, no autoplay/loop so it behaves like a still image */}
      <div className="relative h-[70vh] overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={VIDEO_URL}
          muted
          playsInline
          preload="metadata"
        />
        <div className="absolute inset-0 flex flex-col">
          <Navbar />

          <div className="flex-1 flex flex-col justify-end px-6 md:px-12 lg:px-16 pb-10">
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-normal mb-6 max-w-2xl"
              style={{ letterSpacing: '-0.03em' }}
            >
              Discover your next address.
            </h1>

            <div className="flex items-center gap-2 max-w-xl bg-black/20 backdrop-blur-sm border border-white/25 rounded-full px-2 py-2 mb-4">
              <Search size={18} className="ml-2 text-gray-300 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search by city, locality, or property type..."
                className="bg-transparent flex-1 outline-none text-sm placeholder:text-gray-300 min-w-0"
              />
              <button
                onClick={handleSearch}
                className="bg-white text-black px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors whitespace-nowrap"
              >
                Search
              </button>
            </div>

            <button
              onClick={() => navigate('/search?tab=ai')}
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm w-fit hover:bg-white/20 transition-colors"
            >
              <Sparkles size={14} />
              Get AI personalized recommendations
            </button>
          </div>
        </div>
      </div>

      {/* Recommended for you */}
      <section id="recommended" className="px-6 md:px-12 lg:px-16 py-16">
        <h2 className="text-2xl md:text-3xl font-normal mb-1">
          Recommended for you
        </h2>
        <p className="text-gray-400 text-sm mb-8">
          Based on your budget and recent searches.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommended.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      {/* Feature row */}
      <section className="border-y border-white/10 px-6 md:px-12 lg:px-16 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col items-start gap-3">
              <div className="liquid-glass border border-white/15 rounded-lg p-3">
                <Icon size={20} />
              </div>
              <h3 className="font-medium">{title}</h3>
              <p className="text-sm text-gray-400">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Builder / agent CTA band */}
      <section className="px-6 md:px-12 lg:px-16 py-16 bg-white/[0.03]">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <svg
            viewBox="0 0 400 260"
            className="w-full max-w-md text-white/70"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="40" y="80" width="120" height="150" rx="2" />
            <rect x="180" y="40" width="140" height="190" rx="2" />
            <rect x="60" y="105" width="24" height="24" />
            <rect x="96" y="105" width="24" height="24" />
            <rect x="60" y="140" width="24" height="24" />
            <rect x="96" y="140" width="24" height="24" />
            <rect x="60" y="175" width="24" height="24" />
            <rect x="96" y="175" width="24" height="24" />
            <rect x="200" y="65" width="26" height="26" />
            <rect x="240" y="65" width="26" height="26" />
            <rect x="280" y="65" width="26" height="26" />
            <rect x="200" y="105" width="26" height="26" />
            <rect x="240" y="105" width="26" height="26" />
            <rect x="280" y="105" width="26" height="26" />
            <rect x="230" y="180" width="40" height="50" />
            <path d="M40 80 L100 30 L160 80" />
          </svg>

          <div>
            <h2
              className="text-2xl md:text-3xl font-normal mb-4"
              style={{ letterSpacing: '-0.03em' }}
            >
              List your property with us
            </h2>
            <p className="text-gray-400 mb-6 max-w-md">
              Owners and agents can list properties for free and reach
              buyers matched by our recommendation engine.
            </p>
            <button
              onClick={() => navigate('/list-property')}
              className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              List a Property
            </button>
          </div>
        </div>
      </section>

      {/* Breaker headline */}
      <section className="px-6 md:px-12 lg:px-16 py-14">
        <div className="flex items-center gap-4">
          <div className="h-px bg-white/15 flex-1" />
          <div className="w-2.5 h-2.5 rounded-full border border-white/30" />
          <h2 className="text-xl md:text-2xl text-gray-300 text-center whitespace-nowrap">
            We make property search smarter
          </h2>
          <div className="w-2.5 h-2.5 rounded-full border border-white/30" />
          <div className="h-px bg-white/15 flex-1" />
        </div>
      </section>

      {/* Trending */}
      <section className="px-6 md:px-12 lg:px-16 py-16">
        <h2 className="text-2xl md:text-3xl font-normal mb-1">
          Trending near you
        </h2>
        <p className="text-gray-400 text-sm mb-8">
          Recently listed properties getting the most interest.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trending.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
