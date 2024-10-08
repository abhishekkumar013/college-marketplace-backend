import { ErrorHandler } from '../uttils/errorhandler.middleware.js'

const isAuthorised = (req, res, next) => {
  try {
    if (
      req.user.email === '2105598@kiit.ac.in' ||
      req.user.email === '21051449@kiit.ac.in'
    ) {
      return next()
    }
    throw new ErrorHandler('Unauthorized: User is not admin', 500)
  } catch (error) {
    next(error)
  }
}
export default isAuthorised
