import { Link } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'Search & Recommend', to: '/search' },
  { label: 'Saved', to: '/saved' },
]

export default function Navbar() {
  return (
    <div className="px-6 md:px-12 lg:px-16 pt-6 sticky top-0 z-30">
      <nav className="flex items-center justify-between">
        <Link to="/" className="text-2xl font-semibold tracking-tight">
          VEX
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-sm hover:text-gray-300 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}
