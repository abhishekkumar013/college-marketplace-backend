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
  .get(passport.authenticate('google', { scope: ['profile', 'email'] }))

router.route('/auth/google/callback').get(
  passport.authenticate('google', {
    failureRedirect:
      process.env.NODE_ENV === 'production'
        ? 'https://kiitmart-backend.onrender.com/api/v1/user/auth/failure'
        : 'http://localhost:8080/api/v1/user/auth/failure',
    failureMessage: true,
  }),
  (req, res) => {
    console.log('auth/callbacck ', req.user)

    res.redirect(
      `${process.env.Redirect_url}/login/success?token=${req.user.token}`,
    )
  },
)

router.route('/auth/failure').get((req, res) => {
  const errorMessage = req.session.messages
    ? encodeURIComponent(req.session.messages[0])
    : 'Authentication failed'
  // Clear the error message
  req.session.messages = []
  // Redirect to the frontend with the error message
  res.redirect(`${process.env.Redirect_url}/login?error=${errorMessage}`)
})

router.route('/login/success').get(auth, async (req, res) => {
  console.log('Login Sucess', req.user)
  if (req.user) {
    return res.status(200).json({ message: 'user login', user: req.user })
  }
})

router.route('/logout').get((req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out', error: err })
    }

    req.session.destroy((err) => {
      if (err) {
        return res
          .status(400)
          .json({ message: 'Error destroying session', error: err })
      }

      // Clear session cookie
      res.clearCookie('connect.sid')

      // Clear token cookie (adjust the cookie name if needed)
      res.clearCookie('token')

      return res.status(200).json({ message: 'Logged out successfully' })
    })
  })
})

router.route('/update-profile').put(auth, UpdateUser)

export default router
