import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const UserSchema = new mongoose.Schema(
  {
    displayName: {
      type: String,
      required: true,
    },
    googleId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    hostel: {
      type: String,
      enum: [
        'None',
        'KP-1',
        'KP-2',
        'KP-3',
        'KP-4',
        'KP-5',
        'KP-5A',
        'KP-6AB',
        'KP-6C',
        'KP-7AB',
        'KP-7C',
        'KP-7D',
        'KP-7E',
        'KP-8A',
        'KP-8BC',
        'KP-9C',
        'KP-10A',
        'KP-10B',
        'KP-11',
        'KP-12',
        'KP-14',
        'KP-15',
        'KP-16ABC',
        'KP-18',
        'KP-19',
        'KP-20',
        'KP-21',
        'KP-22',
        'KP-23',
        'KP-24',
        'KP-25',
        'QC-1',
        'QC-2',
        'QC-3',
        'QC-4',
        'QC-5',
        'QC-8',
        'QC-9',
        'QC-10',
        'QC-11',
        'QC-16',
        'QC-17',
      ],
    },
  },
  { timestamps: true },
)

// UserSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next()

//   this.password = await bcrypt.hash(this.password, 10)
//   next()
// })
// UserSchema.method.isPasswordCorrect = async function (password) {
//   return await bcrypt.compare(password, this.password)
// }
UserSchema.method.generateAccessToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
      googleId: this.googleId,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRE },
  )
}

export const User = mongoose.model('User', UserSchema)
