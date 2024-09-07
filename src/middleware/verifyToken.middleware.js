import jwt from 'jsonwebtoken'
import { ErrorHandler } from '../uttils/errorhandler.middleware.js'

const auth = (req, res, next) => {
  try {
    // First, check for session-based authentication
    // if (req.isAuthenticated()) {
    //   return next()
    // }

    // If session auth fails, check for token-based authentication
    const token = req.headers['authorization']?.split(' ')[1]

    if (!token) {
      throw new ErrorHandler('Unauthorized: No token provided', 403)
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        throw new ErrorHandler('Unauthorized: Invalid token', 401)
      }

      req.user = decoded
      next()
    })
  } catch (error) {
    next(error)
  }
}

export default auth
