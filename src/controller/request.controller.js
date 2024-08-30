import { Request } from '../models/userrequest.model.js'
import { ApiResponse } from '../uttils/ApiResponse.js'
import { asyncHandler } from '../uttils/asyncHandler.js'
import { ErrorHandler } from '../uttils/errorhandler.middleware.js'

export const addNewRequest = asyncHandler(async (req, res, next) => {
  try {
    const { name, quantity } = req.body

    // console.log(name, quantity)
    if (!name || !quantity) {
      throw new ErrorHandler('All fields required', 400)
    }
    const request = await Request.create({
      name,
      quantity,
      user: req.user._id,
    })

    if (!request) {
      throw new ErrorHandler('Error in creating request', 400)
    }
    return res
      .status(200)
      .json(new ApiResponse(200, request, 'Request created successfully'))
  } catch (error) {
    next(error)
  }
})

export const getAllRequest = asyncHandler(async (req, res, next) => {
  try {
    const request = await Request.find({}).populate('user', 'phone')

    if (!request) {
      return new ErrorHandler('No Request Found', 400)
    }
    return res
      .status(200)
      .json(new ApiResponse(200, request, 'Request fetched successfully'))
  } catch (error) {
    next(error)
  }
})

export const getUserRequest = asyncHandler(async (req, res, next) => {
  try {
    const request = await Request.find({ user: req.user._id })

    if (!request) {
      return new ErrorHandler('No Request Found', 400)
    }
    return res
      .status(200)
      .json(new ApiResponse(200, request, 'Request fetched successfully'))
  } catch (error) {
    next(error)
  }
})

export const deleteUserRequest = asyncHandler(async (req, res, next) => {
  try {
    const { requestId } = req.params
    const request = await Request.findByIdAndDelete(requestId)

    return res
      .status(200)
      .json(new ApiResponse(200, {}, 'Request Deleted Successfully'))
  } catch (error) {
    next(error)
  }
})
