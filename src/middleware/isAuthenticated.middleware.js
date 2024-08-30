import { ErrorHandler } from '../uttils/errorhandler.middleware.js'

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  return new ErrorHandler('Unauthorized: User not logged in', 500)
}
export default isAuthenticated
