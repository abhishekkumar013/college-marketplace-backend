import express from 'express'
import auth from '../middleware/verifyToken.middleware.js'
import {
  createFeedback,
  getAllFeedbackWithUserNames,
  getRatingsStatistics,
} from '../controller/feedback.controller.js'
import isAuthorised from '../middleware/isAdmin.middleware.js'

const router = express.Router()

router.use(auth)

router.route('/add-feedback').post(createFeedback)
router.route('/ratings').get(isAuthorised, getRatingsStatistics)
router.route('/comments').get(isAuthorised, getAllFeedbackWithUserNames)

export default router
