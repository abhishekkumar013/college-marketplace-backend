import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'delivered', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true },
)

export const Order = mongoose.model('Order', orderSchema)
