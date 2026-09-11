import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { apiFetch, getToken } from '../lib/api'

export default function ListProperty() {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [type, setType] = useState('')
  const [location, setLocation] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!getToken()) {
      navigate('/login')
    }
  }, [navigate])

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []).slice(0, 6)
    setImages(files)
    setPreviews(files.map((file) => URL.createObjectURL(file)))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (!title || !price || !type || !location) {
      setError('Title, price, type, and location are required.')
      return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('price', price)
    formData.append('type', type)
    formData.append('location', location)
    images.forEach((file) => formData.append('images', file))

    setLoading(true)
    try {
      await apiFetch('/properties', { method: 'POST', body: formData })
      setSuccess(true)
      setTimeout(() => navigate('/dashboard'), 1200)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create listing.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 px-6 md:px-12 lg:px-16 py-10 flex justify-center">
        <div className="w-full max-w-2xl">
          <h1
            className="text-3xl font-normal mb-1"
            style={{ letterSpacing: '-0.03em' }}
          >
            List your property
          </h1>
          <p className="text-gray-400 text-sm mb-8">
            Fill in the details below. Buyers matched to this listing will
            see it in their recommendations.
          </p>

          {success ? (
            <div className="liquid-glass border border-white/20 rounded-xl p-6 text-center">
              Listing created. Taking you to the dashboard...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm text-gray-300 mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 3BHK Modern Apartment"
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-white/50 transition-colors placeholder:text-gray-500"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-gray-300 mb-1.5">
                    Price
                  </label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. ₹85 L or ₹22,000/month"
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-white/50 transition-colors placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1.5">
                    Type
                  </label>
                  <input
                    type="text"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    placeholder="e.g. 3BHK Apartment, Villa, Office"
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-white/50 transition-colors placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1.5">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Whitefield, Bengaluru"
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-white/50 transition-colors placeholder:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1.5">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Tell buyers a bit more about this property..."
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-white/50 transition-colors placeholder:text-gray-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1.5">
                  Photos (up to 6)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-white/20 file:bg-white/5 file:text-white file:text-sm hover:file:bg-white/10 file:cursor-pointer cursor-pointer"
                />

                {previews.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-3">
                    {previews.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`Preview ${i + 1}`}
                        className="w-full h-20 object-cover rounded-lg border border-white/10"
                      />
                    ))}
                  </div>
                )}
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-60"
              >
                {loading ? 'Publishing...' : 'Publish listing'}
              </button>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
