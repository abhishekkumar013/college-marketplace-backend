import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    desc: {
      type: String,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mrp: {
      type: Number,
      required: true,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    additionalCharge: {
      type: Number,
      default: 0,
    },
    finalPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
)

export const Product = mongoose.model('Product', ProductSchema)
