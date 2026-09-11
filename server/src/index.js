import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { connectDB } from './db.js'
import authRoutes from './routes/auth.js'
import propertyRoutes from './routes/properties.js'
import samplePropertyRoutes from './routes/sampleProperties.js'
import recommendRoutes from './routes/recommend.js'

const app = express()

const corsOrigins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((value) => value.trim())
app.use(cors({ origin: corsOrigins, credentials: true }))
app.use(express.json())

// Serve uploaded property images statically at /uploads/<filename>
app.use('/uploads', express.static(path.resolve('uploads')))

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/properties', propertyRoutes)
app.use('/api/sample-properties', samplePropertyRoutes)
app.use('/api/recommend', recommendRoutes)

const PORT = process.env.PORT || 5000

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message)
    process.exit(1)
  })
