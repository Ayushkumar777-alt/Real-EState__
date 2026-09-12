import express from 'express'
import cors from 'cors'
import { connectDB } from '../server/src/db.js'
import authRoutes from '../server/src/routes/auth.js'
import propertyRoutes from '../server/src/routes/properties.js'
import samplePropertyRoutes from '../server/src/routes/sampleProperties.js'
import recommendRoutes from '../server/src/routes/recommend.js'

const app = express()

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/properties', propertyRoutes)
app.use('/api/sample-properties', samplePropertyRoutes)
app.use('/api/recommend', recommendRoutes)

let dbConnected = false

export default async function handler(req, res) {
  if (!dbConnected) {
    try {
      await connectDB()
      dbConnected = true
    } catch (err) {
      console.error('DB Connection error:', err)
      return res.status(500).json({ message: 'Database connection failed.', error: err.message })
    }
  }
  return app(req, res)
}
