import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: [40, 'Product name cannot exceed 40 characters'],
      set: (v) => v.charAt(0).toUpperCase() + v.slice(1),
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
      min: 0,
    },
    desc: {
      type: String,
      trim: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mrp: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    additionalCharge: {
      type: Number,
      default: 0,
      min: 0,
    },
    finalPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    isSold: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

export const Product = mongoose.model('Product', ProductSchema)
