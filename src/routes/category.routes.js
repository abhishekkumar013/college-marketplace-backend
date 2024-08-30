import express from 'express'
import isAuthenticated from '../middleware/isAuthenticated.middleware.js'
import {
  addCategory,
  getAllCategory,
} from '../controller/category.controller.js'
import isAuthorised from '../middleware/isAdmin.middleware.js'

const router = express.Router()

router.use(isAuthenticated)
router.route('/add').post(isAuthorised, addCategory)
router.route('/get-all').get(getAllCategory)

export default router
