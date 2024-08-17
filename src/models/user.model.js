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
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  this.password = await bcrypt.hash(this.password, 10)
  next()
})
UserSchema.method.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password)
}
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
