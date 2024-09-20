import { Feedback } from '../models/feedback.moodel.js'
import { ApiResponse } from '../uttils/ApiResponse.js'
import { asyncHandler } from '../uttils/asyncHandler.js'
import { ErrorHandler } from '../uttils/errorhandler.middleware.js'

export const createFeedback = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user._id
    const { message, rating } = req.body
    if (!message || rating === undefined) {
      throw new ErrorHandler('Missing Fields', 400)
    }
    await Feedback.create({ message, rating, userId })

    return res
      .status(201)
      .json(new ApiResponse(201, {}, 'Thank You For Your Feedback Submission'))
  } catch (error) {
    next(error)
  }
})
export const getRatingsStatistics = asyncHandler(async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find()

    if (feedbacks.length === 0) {
      return res
        .status(200)
        .json(new ApiResponse(200, {}, 'No feedback available'))
    }

    const ratingsCount = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    }

    let totalRating = 0

    feedbacks.forEach((feedback) => {
      if (feedback.rating >= 1 && feedback.rating <= 5) {
        ratingsCount[feedback.rating]++
        totalRating += feedback.rating
      }
    })

    const averageRating = (totalRating / feedbacks.length).toFixed(2)

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          ratingsCount,
          averageRating,
        },
        'Ratings statistics retrieved successfully',
      ),
    )
  } catch (error) {
    next(error)
  }
})

export const getAllFeedbackWithUserNames = asyncHandler(
  async (req, res, next) => {
    try {
      const feedbacks = await Feedback.find().populate('userId', 'displayName')

      if (feedbacks.length === 0) {
        return res
          .status(200)
          .json(new ApiResponse(200, {}, 'No feedback available'))
      }

      const feedbackWithUserNames = feedbacks.map((feedback) => ({
        message: feedback.message,
        rating: feedback.rating,
        userName: feedback.userId.displayName,
        createdAt: feedback.createdAt,
      }))

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            feedbackWithUserNames,
            'Feedback messages retrieved successfully',
          ),
        )
    } catch (error) {
      next(error)
    }
  },
)
