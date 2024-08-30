import { ErrorHandler } from '../uttils/errorhandler.middleware.js'

const isAuthorised = (req, res, next) => {
  if (req.user.email === '2105598@kiit.ac.in') {
    return next()
  }
  return new ErrorHandler('Unauthorized: User not logged in', 500)
}
export default isAuthorised
