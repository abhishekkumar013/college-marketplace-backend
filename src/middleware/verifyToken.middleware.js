import jwt from 'jsonwebtoken'
import { ErrorHandler } from '../uttils/errorhandler.middleware.js'
import { User } from '../models/user.model.js'

const auth = async (req, res, next) => {
  try {
    // Extract the token from cookies
    const { token } = req.cookies

    if (!token) {
      throw new ErrorHandler('Unauthorized: No token provided', 403)
    }

    // Verify the token
    const decode = await jwt.verify(token, process.env.JWT_SECRET)
    
    req.user = await User.findById(decode._id)
    next()
  } catch (error) {
    next(error)
  }
}

export default auth

// const auth = (req, res, next) => {
//   try {
//     // First, check for session-based authentication
//     // if (req.isAuthenticated()) {
//     //   return next()
//     // }

//     // If session auth fails, check for token-based authentication
//     const token = req.headers['authorization']?.split(' ')[1]

//     if (!token) {
//       throw new ErrorHandler('Unauthorized: No token provided', 403)
//     }

//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//       if (err) {
//         throw new ErrorHandler('Unauthorized: Invalid token', 401)
//       }

//       req.user = decoded
//       next()
//     })
//   } catch (error) {
//     next(error)
//   }
// }
