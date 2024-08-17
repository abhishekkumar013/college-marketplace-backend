import { Category } from '../models/category.model.js'
import { ApiResponse } from '../uttils/ApiResponse.js'
import { asyncHandler } from '../uttils/asyncHandler'

import { Category } from './models/Category.js'

export const addCategory = asyncHandler(async (req, res) => {
  const { name } = req.body

  if (!name) {
    return res.status(404).json(new ApiResponse(404, {}, 'All fields required'))
  }

  try {
    const category = await Category.create({ name })
    return res
      .status(200)
      .json(new ApiResponse(200, category, 'Category Created successfully'))
  } catch (error) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, 'Category creation failed'))
  }
})

export const getAllCategory = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({})

    if (!categories || categories.length === 0) {
      return res.status(404).json(new ApiResponse(404, {}, 'No Category Found'))
    }

    return res
      .status(200)
      .json(new ApiResponse(200, categories, 'All Categories Fetched'))
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, {}, 'Internal Server Error'))
  }
})
