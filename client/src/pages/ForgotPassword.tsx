import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { apiFetch } from '../lib/api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [devToken, setDevToken] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email) return
    setError('')
    setLoading(true)

    try {
      const data = await apiFetch('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      })
      setSent(true)
      // Only present because no email service is configured yet - see the
      // note in server/src/routes/auth.js. Once Nodemailer/SMTP is set up,
      // this field goes away and a real email gets sent instead.
      setDevToken(data.devResetToken || null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-md liquid-glass border border-white/20 rounded-xl px-8 py-10">
        {sent ? (
          <>
            <h1
              className="text-3xl font-semibold mb-1"
              style={{ letterSpacing: '-0.03em' }}
            >
              Check your email
            </h1>
            <p className="text-gray-300 text-sm mb-6">
              If an account exists for {email}, a reset link is on its way.
            </p>

            {devToken && (
              <div className="bg-white/5 border border-white/15 rounded-lg p-3 mb-6 text-xs text-gray-300">
                <p className="mb-2">
                  No email service is set up yet, so here's a link for
                  testing the reset flow directly:
                </p>
                <Link
                  to={`/reset-password?token=${devToken}`}
                  className="text-white underline break-all"
                >
                  /reset-password?token={devToken}
                </Link>
              </div>
            )}

            <Link to="/login" className="text-sm text-white hover:underline">
              &larr; Back to login
            </Link>
          </>
        ) : (
          <>
            <h1
              className="text-3xl font-semibold mb-1"
              style={{ letterSpacing: '-0.03em' }}
            >
              Reset your password
            </h1>
            <p className="text-gray-300 text-sm mb-8">
              Enter your email and we&apos;ll send you a link to reset it.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-white/50 transition-colors placeholder:text-gray-500"
                />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="bg-white text-black py-2.5 rounded-lg font-medium hover:bg-gray-100 transition-colors mt-2 disabled:opacity-60"
              >
                {loading ? 'Sending...' : 'Send reset link'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-400 mt-8">
              <Link to="/login" className="text-white hover:underline">
                Back to login
              </Link>
            </p>
          </>
        )}
      </div>
    </AuthLayout>
  )
}
