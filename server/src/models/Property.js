import mongoose from 'mongoose'

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    images: [{ type: String }], // stored file paths, e.g. /uploads/xyz.jpg
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['active', 'pending', 'sold'],
      default: 'active',
    },
  },
  { timestamps: true },
)

export default mongoose.model('Property', propertySchema)
