import mongoose from 'mongoose'

const UserRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  qantity: {
    type: Number,
    default: 0,
  },
})
