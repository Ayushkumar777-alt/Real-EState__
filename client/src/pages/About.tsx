import { Search, Sparkles, ListChecks, MessagesSquare } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const STEPS = [
  { title: 'Tell us what you want', description: 'Set your budget, location, and property type.' },
  { title: 'We match listings', description: 'Our engine ranks properties against your preferences.' },
  { title: 'Compare & shortlist', description: 'Review details side by side, no visits needed yet.' },
  { title: 'Connect directly', description: 'Message the owner or agent when you are ready.' },
]

const FEATURES = [
  { icon: Sparkles, title: 'Smart Recommendations' },
  { icon: ListChecks, title: 'Verified Listings' },
  { icon: MessagesSquare, title: 'Direct Inquiries' },
  { icon: Search, title: 'Powerful Search & Filters' },
]

export default function About() {
  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />

      <section className="px-6 md:px-12 lg:px-16 pt-16 pb-12">
        <h1
          className="text-4xl md:text-5xl font-normal mb-4 max-w-2xl"
          style={{ letterSpacing: '-0.03em' }}
        >
          Making property search smarter.
        </h1>
        <p className="text-gray-400 max-w-xl">
          VEX is a Smart Real Estate Recommendation Portal built to simplify
          how people find, compare, and choose properties.
        </p>
      </section>

      <section className="px-6 md:px-12 lg:px-16 py-12 border-y border-white/10">
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-xl font-medium mb-3">The problem</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Finding a suitable property is hard. Listings are scattered
              across sites, prices vary widely, and every buyer has different
              needs around location, budget, and amenities — making it easy
              to miss the right match.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-medium mb-3">Our approach</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              VEX centralizes listings in one place and uses a
              recommendation engine that looks at your preferences, search
              history, and market trends to surface the properties most
              relevant to you.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-16 py-16">
        <h2 className="text-2xl font-normal mb-8">How it works</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="liquid-glass border border-white/15 rounded-xl p-5"
            >
              <span className="text-gray-500 text-sm">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-medium mt-2 mb-1">{step.title}</h3>
              <p className="text-sm text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-16 py-16 bg-white/[0.03]">
        <h2 className="text-2xl font-normal mb-8">What you get</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map(({ icon: Icon, title }) => (
            <div key={title} className="flex flex-col items-start gap-3">
              <div className="liquid-glass border border-white/15 rounded-lg p-3">
                <Icon size={20} />
              </div>
              <h3 className="font-medium text-sm">{title}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-16 py-16 text-center">
        <p className="text-gray-500 text-sm mb-2">Built by</p>
        <h2 className="text-xl font-medium mb-1">Aatif</h2>
        <p className="text-gray-400 text-sm">
          MERN stack · React, TypeScript, Node.js, Express, MongoDB
        </p>
      </section>

      <Footer />
    </div>
  )
}
