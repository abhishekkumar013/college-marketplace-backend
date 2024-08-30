import { User } from '../models/user.model.js'
import { ApiResponse } from '../uttils/ApiResponse.js'
import { asyncHandler } from '../uttils/asyncHandler.js'
import { ErrorHandler } from '../uttils/errorhandler.middleware.js'

// const generateUserAccessToken = async (userId) => {
//   try {
//     const user = await User.findById(userId)
//     const accessToken = await user.generateAccessToken()

//     return { accessToken }
//   } catch (error) {
//     return res.status(500).json({})
//   }
// }
// export const loginController = async (req, res) => {
//   // Successful authentication
//   const user = req.user
// }
export const authFailure = asyncHandler(async (req, res, next) => {
  try {
    const errorMessage = req.session.messages
      ? encodeURIComponent(req.session.messages[0])
      : 'Authentication failed'
    req.session.messages = []
    res.redirect(`http://localhost:5173/login?error=${errorMessage}`)
  } catch (error) {
    next(error)
  }
})

export const LoginSuccess = asyncHandler(async (req, res, next) => {
  try {
    if (req.user) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { user: req.user },
            'User logged in successfully',
          ),
        )
    } else {
      throw new ErrorHandler('User Not Logged In', 400)
    }
  } catch (error) {
    next(error)
  }
})

export const LogoutUser = asyncHandler(async (req, res, next) => {
  try {
    await new Promise((resolve, reject) => {
      req.logout((err) => {
        if (err) reject(err)
        else resolve()
      })
    })

    await new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) reject(err)
        else resolve()
      })
    })

    res.clearCookie('connect.sid')
    return res
      .status(200)
      .json(new ApiResponse(200, {}, 'Logged out successfully'))
  } catch (error) {
    next(error)
  }
})
export const UpdateUser = asyncHandler(async (req, res, next) => {
  try {
    const { displayName, phone, hostel } = req.body

    if (!displayName || !phone || !hostel) {
      throw new ErrorHandler('All fields are required', 404)
    }

    const existingUser = await User.findById(req.user._id)

    if (!existingUser) {
      throw new ErrorHandler('User not found', 404)
    }

    existingUser.displayName = displayName
    if (phone) existingUser.phone = phone
    if (hostel) existingUser.hostel = hostel

    await existingUser.save()

    return res
      .status(200)
      .json(new ApiResponse(200, existingUser, 'Profile updated successfully'))
  } catch (error) {
    next(error)
  }
})
