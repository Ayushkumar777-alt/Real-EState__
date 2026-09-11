import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { apiFetch, setSession } from '../lib/api'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined

type Mode = 'signup' | 'login'

export default function Auth() {
  const navigate = useNavigate()
  const googleBtnRef = useRef<HTMLDivElement>(null)

  const [mode, setMode] = useState<Mode>('signup')
  const [name, setName] = useState('')
  const [email, setEmail] = useState(
    () => localStorage.getItem('vex_remembered_email') || '',
  )
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(
    () => !!localStorage.getItem('vex_remembered_email'),
  )
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleGoogleResponse(response: { credential: string }) {
    setError('')
    try {
      const data = await apiFetch('/auth/google', {
        method: 'POST',
        body: JSON.stringify({ credential: response.credential }),
      })
      setSession(data.token, data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed.')
    }
  }

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !googleBtnRef.current) return

    let cancelled = false

    const initializeGoogleButton = () => {
      if (cancelled || !googleBtnRef.current || !window.google?.accounts?.id) return

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      })
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: 'filled_black',
        size: 'large',
        width: 320,
        text: mode === 'signup' ? 'signup_with' : 'signin_with',
      })
    }

    if (window.google?.accounts?.id) {
      initializeGoogleButton()
    } else {
      const existingScript = document.querySelector('script[src*="gsi/client"]')
      if (existingScript) {
        existingScript.addEventListener('load', initializeGoogleButton, { once: true })
      } else {
        const script = document.createElement('script')
        script.src = 'https://accounts.google.com/gsi/client'
        script.async = true
        script.defer = true
        script.onload = initializeGoogleButton
        document.head.appendChild(script)
      }
    }

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please enter both email and password.')
      return
    }

    setLoading(true)
    try {
      const data =
        mode === 'signup'
          ? await apiFetch('/auth/register', {
              method: 'POST',
              body: JSON.stringify({ name, email, password }),
            })
          : await apiFetch('/auth/login', {
              method: 'POST',
              body: JSON.stringify({ email, password }),
            })

      if (remember) {
        localStorage.setItem('vex_remembered_email', email)
      } else {
        localStorage.removeItem('vex_remembered_email')
      }

      setSession(data.token, data.user)
      navigate('/dashboard')
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
          {mode === 'signup' ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="text-gray-300 text-sm mb-8">
          {mode === 'signup'
            ? 'Sign up to get property recommendations made for you.'
            : 'Log in to keep exploring recommended properties.'}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-white/50 transition-colors placeholder:text-gray-500"
              />
            </div>
          )}

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

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm text-gray-300">Password</label>
              {mode === 'login' && (
                <Link
                  to="/forgot-password"
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Forgot password?
                </Link>
              )}
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-white/50 transition-colors placeholder:text-gray-500"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          {mode === 'login' && (
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 accent-white"
              />
              Remember me
            </label>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-white text-black py-2.5 rounded-lg font-medium hover:bg-gray-100 transition-colors mt-2 disabled:opacity-60"
          >
            {loading
              ? 'Please wait...'
              : mode === 'signup'
                ? 'Sign up'
                : 'Log in'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="h-px bg-white/20 flex-1" />
          <span className="text-xs text-gray-400">or</span>
          <div className="h-px bg-white/20 flex-1" />
        </div>

        {GOOGLE_CLIENT_ID ? (
          <div ref={googleBtnRef} className="flex justify-center" />
        ) : (
          <button
            type="button"
            disabled
            title="Add VITE_GOOGLE_CLIENT_ID in client/.env to enable this"
            className="w-full flex items-center justify-center gap-3 border border-white/10 rounded-lg py-2.5 text-sm font-medium text-gray-500 cursor-not-allowed"
          >
            Continue with Google (set up VITE_GOOGLE_CLIENT_ID)
          </button>
        )}

        <p className="text-center text-sm text-gray-400 mt-8">
          {mode === 'signup' ? (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-white hover:underline"
              >
                Log in
              </button>
            </>
          ) : (
            <>
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-white hover:underline"
              >
                Sign up
              </button>
            </>
          )}
        </p>
      </div>
    </AuthLayout>
  )
}
