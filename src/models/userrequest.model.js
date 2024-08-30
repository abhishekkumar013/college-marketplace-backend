import mongoose from 'mongoose'

const UserRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    quantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
)

export const Request = mongoose.model('Request', UserRequestSchema)
