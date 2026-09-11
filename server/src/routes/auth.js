import express from 'express'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { OAuth2Client } from 'google-auth-library'
import User from '../models/User.js'
import { generateToken } from '../utils/generateToken.js'

const router = express.Router()
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, passwordHash })

    const token = generateToken(user)
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (err) {
    res.status(500).json({ message: 'Registration failed.', error: err.message })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user || !user.passwordHash) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const match = await bcrypt.compare(password, user.passwordHash)
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const token = generateToken(user)
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (err) {
    res.status(500).json({ message: 'Login failed.', error: err.message })
  }
})

// POST /api/auth/google
// Expects { credential } - the ID token from Google Identity Services on the frontend
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body
    if (!credential) {
      return res.status(400).json({ message: 'Missing Google credential.' })
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    const payload = ticket.getPayload()

    let user = await User.findOne({ email: payload.email.toLowerCase() })
    if (!user) {
      user = await User.create({
        name: payload.name,
        email: payload.email,
        googleId: payload.sub,
      })
    } else if (!user.googleId) {
      user.googleId = payload.sub
      await user.save()
    }

    const token = generateToken(user)
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (err) {
    res.status(401).json({ message: 'Google sign-in failed.', error: err.message })
  }
})

// POST /api/auth/forgot-password
// Generates a reset token. Actually emailing it requires an email service
// (e.g. Nodemailer + SMTP credentials) which isn't configured here yet.
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email: email?.toLowerCase() })

    // Always respond the same way, whether or not the user exists,
    // so people can't use this to guess registered emails.
    if (!user) {
      return res.json({ message: 'If that account exists, a reset link has been sent.' })
    }

    const token = crypto.randomBytes(32).toString('hex')
    user.resetPasswordToken = token
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 30 // 30 minutes
    await user.save()

    // TODO: send `token` via email once an email service is wired up.
    // For now, it's returned directly so the reset flow can be tested.
    res.json({
      message: 'If that account exists, a reset link has been sent.',
      devResetToken: token,
    })
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.', error: err.message })
  }
})

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({ message: 'Reset link is invalid or has expired.' })
    }

    user.passwordHash = await bcrypt.hash(password, 10)
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()

    res.json({ message: 'Password updated. You can now log in.' })
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.', error: err.message })
  }
})

export default router
