import express from 'express'

import {
  addNewRequest,
  deleteUserRequest,
  getAllRequest,
  getUserRequest,
} from '../controller/request.controller.js'
import isAuthenticated from '../middleware/isAuthenticated.middleware.js'
import auth from '../middleware/verifyToken.middleware.js'

const router = express.Router()

// router.use(isAuthenticated)
router.use(auth)

router.route('/create').post(addNewRequest)
router.route('/get-all').get(getAllRequest)

router.route('/get-user').get(getUserRequest)
router.route('/delete/:requestId').delete(deleteUserRequest)

export default router
