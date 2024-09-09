import express from 'express'
import passport from 'passport'
import isAuthenticated from '../middleware/isAuthenticated.middleware.js'
import { UpdateUser } from '../controller/user.controller.js'
import { ErrorHandler } from '../uttils/errorhandler.middleware.js'
import jwt from 'jsonwebtoken'
import auth from '../middleware/verifyToken.middleware.js'

const router = express.Router()

router.get(
  '/auth/google',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const token = jwt.sign(
      {
        id: req.user._id,
        email: req.user.email,
        displayName: req.user.displayName,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
    )

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    })

    res.redirect('http://localhost:5173/login/success')
  },
)

router.get('/api/v1/user/logout', (req, res) => {
  res.clearCookie('token')
  res.json({ message: 'Logged out successfully' })
})

router.route('/update-profile').put(auth, UpdateUser)

export default router
