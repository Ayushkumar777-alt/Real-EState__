import express from 'express'
import cors from 'cors'
import path from 'path'
import { connectDB } from '../server/src/db.js'
import authRoutes from '../server/src/routes/auth.js'
import propertyRoutes from '../server/src/routes/properties.js'
import samplePropertyRoutes from '../server/src/routes/sampleProperties.js'
import recommendRoutes from '../server/src/routes/recommend.js'

const app = express()

const corsOrigins = (process.env.CLIENT_URL || '*').split(',').map((v) => v.trim())
app.use(cors({ origin: corsOrigins, credentials: true }))
app.use(express.json())

// Ensure MongoDB connection for every serverless request
app.use(async (req, res, next) => {
  try {
    await connectDB()
    next()
  } catch (err) {
    console.error('Database connection error in Vercel function:', err)
    res.status(500).json({ message: 'Database connection failure. Please check MONGODB_URI in Vercel settings.', error: err.message })
  }
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', environment: 'vercel-serverless' })
})

app.use('/api/auth', authRoutes)
app.use('/api/properties', propertyRoutes)
app.use('/api/sample-properties', samplePropertyRoutes)
app.use('/api/recommend', recommendRoutes)

export default app
