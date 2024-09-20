import mongoose from 'mongoose'

const feedbackSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      max: 5,
      min: 1,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
)

export const Feedback = mongoose.model('Feedback', feedbackSchema)
