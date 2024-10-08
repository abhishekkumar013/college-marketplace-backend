import express from 'express'
import passport from 'passport'
import { ErrorHandler } from '../uttils/errorhandler.middleware.js'
import auth from '../middleware/verifyToken.middleware.js'
import { UpdateUser } from '../controller/user.controller.js'

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
   
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000 
    }
    res
      .status(200)
      .cookie('token', req.user.token, options)
      .redirect(`${process.env.Redirect_url}/login/success`)
  },
)

router.route('/auth/failure').get((req, res) => {
  const errorMessage = req.session?.messages
    ? encodeURIComponent(req.session.messages[0])
    : 'Use Kiit Email Id For Login'
  // Clear the error message
  req.session.messages = []
  // Redirect to the frontend with the error message
  res.redirect(`${process.env.Redirect_url}/login?error=${errorMessage}`)
})

router.route('/login/success').get(auth, (req, res) => {
 
  if (req.user) {
    return res.status(200).json({ message: 'User login', user: req.user })
  }
})

router.route('/logout').get((req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
  })

  return res.status(200).json({ message: 'Logged out successfully' })
})

router.route('/update-profile').put(auth, UpdateUser)

export default router
