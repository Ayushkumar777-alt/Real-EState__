import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { connectDB } from '../server/src/db.js'
import authRoutes from '../server/src/routes/auth.js'
import propertyRoutes from '../server/src/routes/properties.js'
import samplePropertyRoutes from '../server/src/routes/sampleProperties.js'
import recommendRoutes from '../server/src/routes/recommend.js'

const app = express()

app.use(cors({ origin: '*', credentials: true }))
app.use(express.json())

app.use('/uploads', express.static(path.resolve('server/uploads')))

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/properties', propertyRoutes)
app.use('/api/sample-properties', samplePropertyRoutes)
app.use('/api/recommend', recommendRoutes)

export default async function handler(req, res) {
  try {
    await connectDB()
  } catch (err) {
    console.error('DB Connection error in handler:', err)
  }
  return app(req, res)
}
