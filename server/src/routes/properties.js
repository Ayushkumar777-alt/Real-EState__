import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import Property from '../models/Property.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

const uploadsDir = process.env.VERCEL ? '/tmp/uploads' : path.resolve('uploads')
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
  }
} catch { /* read-only filesystem on serverless — file uploads won't persist */ }

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `${unique}${path.extname(file.originalname)}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per image
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Only image files are allowed.'))
  },
})

// GET /api/properties - list all, newest first
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 })
    res.json(properties)
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch properties.', error: err.message })
  }
})

// GET /api/properties/:id
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
    if (!property) return res.status(404).json({ message: 'Property not found.' })
    res.json(property)
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch property.', error: err.message })
  }
})

// POST /api/properties - create a listing (requires login, accepts up to 6 images)
router.post('/', requireAuth, upload.array('images', 6), async (req, res) => {
  try {
    const { title, description, price, type, location } = req.body

    if (!title || !price || !type || !location) {
      return res.status(400).json({ message: 'Title, price, type, and location are required.' })
    }

    const images = (req.files || []).map((file) => `/uploads/${file.filename}`)

    const property = await Property.create({
      title,
      description,
      price,
      type,
      location,
      images,
      owner: req.user.id,
    })

    res.status(201).json(property)
  } catch (err) {
    res.status(500).json({ message: 'Could not create listing.', error: err.message })
  }
})

// DELETE /api/properties/:id - only the owner can delete their own listing
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
    if (!property) return res.status(404).json({ message: 'Property not found.' })

    if (property.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own listings.' })
    }

    await property.deleteOne()
    res.json({ message: 'Listing deleted.' })
  } catch (err) {
    res.status(500).json({ message: 'Could not delete listing.', error: err.message })
  }
})

export default router
