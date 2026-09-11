import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import Property from './models/Property.js'
import { sampleProperties } from './data/sampleProperties.js'

let mongodInstance = null

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return
  }

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vex'

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    })
    console.log('MongoDB connected (local/remote server)')
  } catch (err) {
    if (process.env.VERCEL) {
      console.error(`Vercel environment detected. Could not connect to MONGODB_URI: ${err.message}`)
      throw err
    }
    console.warn(`Could not connect to MongoDB at ${uri} (${err.message}). Starting In-Memory MongoDB server...`)
    try {
      mongodInstance = await MongoMemoryServer.create()
      const mongoUri = mongodInstance.getUri()
      await mongoose.connect(mongoUri)
      console.log('In-Memory MongoDB connected successfully!')
    } catch (memErr) {
      console.error('Failed to start In-Memory MongoDB:', memErr.message)
      throw memErr
    }
  }

  // Seed sample properties if Property collection is empty
  try {
    const count = await Property.countDocuments()
    if (count === 0) {
      // Create a system demo user object id for seeding sample properties
      const demoOwnerId = new mongoose.Types.ObjectId()
      const seedData = sampleProperties.map(p => ({
        title: p.title,
        description: `${p.furnishing} ${p.type} located in ${p.locality}, ${p.city}. Amenities include ${p.amenities.join(', ')}.`,
        price: `₹${(p.price / 100000).toFixed(2)} Lakhs`,
        type: p.type,
        location: `${p.locality}, ${p.city}`,
        images: p.images,
        owner: demoOwnerId,
        status: 'active',
      }))
      await Property.insertMany(seedData)
      console.log(`Seeded ${seedData.length} initial properties into MongoDB.`)
    }
  } catch (seedErr) {
    console.warn('Sample properties seeding warning:', seedErr.message)
  }
}

