import { ErrorHandler } from '../uttils/errorhandler.middleware.js'

const isAuthenticated = (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      return next()
    }
    throw new ErrorHandler('Unauthorized: User not logged in', 500)
  } catch (error) {
    next(error)
  }
}
export default isAuthenticated
