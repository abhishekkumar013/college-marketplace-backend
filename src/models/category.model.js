import mongoose from 'mongoose'

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: (v) => v.charAt(0).toUpperCase() + v.slice(1),
  },
})
export const Category = mongoose.model('Category', CategorySchema)
