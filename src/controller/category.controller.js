import { Category } from '../models/category.model.js'
import { ApiResponse } from '../uttils/ApiResponse.js'
import { asyncHandler } from '../uttils/asyncHandler.js'
import { ErrorHandler } from '../uttils/errorhandler.middleware.js'

export const addCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body

  if (!name) {
    throw new ErrorHandler('All fields required', 404)
  }

  try {
    const category = await Category.create({ name })
    return res
      .status(200)
      .json(new ApiResponse(200, category, 'Category Created successfully'))
  } catch (error) {
    next(error)
  }
})

export const getAllCategory = asyncHandler(async (req, res, next) => {
  try {
    const categories = await Category.find({})

    if (!categories || categories.length === 0) {
      throw new ErrorHandler('No Category Found', 404)
    }

    return res
      .status(200)
      .json(new ApiResponse(200, categories, 'All Categories Fetched'))
  } catch (error) {
    next(error)
  }
})
