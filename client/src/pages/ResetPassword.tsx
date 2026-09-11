import { useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { apiFetch } from '../lib/api'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') || ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setError('Password should be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      await apiFetch('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, password }),
      })
      setDone(true)
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-md liquid-glass border border-white/20 rounded-xl px-8 py-10">
        <h1
          className="text-3xl font-semibold mb-1"
          style={{ letterSpacing: '-0.03em' }}
        >
          Set a new password
        </h1>

        {!token && (
          <p className="text-red-400 text-sm mt-4">
            This link is missing a reset token. Request a new one from{' '}
            <Link to="/forgot-password" className="underline">
              the forgot password page
            </Link>
            .
          </p>
        )}

        {token && done && (
          <p className="text-gray-300 text-sm mt-6">
            Password updated. Taking you to login...
          </p>
        )}

        {token && !done && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">
                New password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-white/50 transition-colors placeholder:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1.5">
                Confirm password
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-white/50 transition-colors placeholder:text-gray-500"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="bg-white text-black py-2.5 rounded-lg font-medium hover:bg-gray-100 transition-colors mt-2 disabled:opacity-60"
            >
              {loading ? 'Updating...' : 'Update password'}
            </button>
          </form>
        )}
      </div>
    </AuthLayout>
  )
}
