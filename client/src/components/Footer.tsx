import { Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 md:px-12 lg:px-16 py-10 mt-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <span className="text-xl font-semibold tracking-tight">VEX</span>
          <p className="text-gray-400 text-sm mt-1 max-w-sm">
            Smart property recommendations, matched to your budget and your
            life.
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <Phone size={14} />
            +91 90000 00000
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} />
            LPU, Punjab
          </div>
        </div>
      </div>

      <p className="text-gray-500 text-xs mt-8">
        © {new Date().getFullYear()} VEX. Built as a college project — Smart
        Real Estate Recommendation Portal.
      </p>
    </footer>
  )
}
