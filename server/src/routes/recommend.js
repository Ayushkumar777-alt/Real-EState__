import express from 'express'
import { sampleProperties } from '../data/sampleProperties.js'
import { getGroqRecommendations } from '../utils/groqClient.js'
import { scoreProperties } from '../utils/recommendationEngine.js'

const router = express.Router()

// POST /api/recommend
// Body: { budget, city, locality, propertyType, bhk, amenities }
router.post('/', async (req, res) => {
  const preferences = req.body || {}

  if (process.env.GROQ_API_KEY) {
    try {
      const results = await getGroqRecommendations(preferences, sampleProperties)
      return res.json({ source: 'ai', results })
    } catch (err) {
      console.error('Groq recommendation failed, falling back to local engine:', err.message)
    }
  }

  const results = scoreProperties(preferences, sampleProperties).slice(0, 5)
  res.json({ source: 'fallback', results })
})

export default router
