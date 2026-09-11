import express from 'express'
import { sampleProperties } from '../data/sampleProperties.js'

const router = express.Router()

// GET /api/sample-properties - returns the full sample dataset.
// Filtering happens on the frontend since this list is small; for a much
// larger dataset you'd move filtering here with query params instead.
router.get('/', (req, res) => {
  res.json(sampleProperties)
})

export default router
