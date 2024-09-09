import express from 'express'
import passport from 'passport'
import isAuthenticated from '../middleware/isAuthenticated.middleware.js'
import { UpdateUser } from '../controller/user.controller.js'
import { ErrorHandler } from '../uttils/errorhandler.middleware.js'
import jwt from 'jsonwebtoken'
import auth from '../middleware/verifyToken.middleware.js'

const router = express.Router()

router
  .route('/auth/google')
  .get(
    passport.authenticate('google', { scope: ['profile', 'email', 'openid'] }),
  )

router.route('/auth/google/callback').get(
  passport.authenticate('google', {
    failureRedirect:
      'https://kiitmart-backend.onrender.com/api/v1/user/auth/failure',
    failureMessage: true,
  }),
  (req, res) => {
    res.redirect(`http://localhost:5173/login/success?token=${req.user.token}`)
  },
)

router.route('/auth/failure').get((req, res) => {
  const errorMessage = req.session.messages
    ? encodeURIComponent(req.session.messages[0])
    : 'Authentication failed'
  // Clear the error message
  req.session.messages = []
  // Redirect to the frontend with the error message
  res.redirect(`http://localhost:5173/login?error=${errorMessage}`)
})

router.route('/login/success').get(async (req, res) => {
  if (req.user) {
    console.log(req.user)
    return res.status(200).json({ message: 'user login', user: req.user })
  } else {
    return new ErrorHandler('User Not Login', 400)
  }
})

router.route('/logout').get((req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out', error: err })
    }
    req.session.destroy((err) => {
      if (err) {
        return new ErrorHandler('Error destroying session', 400)
      }
      res.clearCookie('connect.sid')
      return res.status(200).json({ message: 'Logged out successfully' })
    })
  })
})

router.route('/update-profile').put(auth, UpdateUser)

export default router
