import express from 'express'
import isAuthenticated from '../middleware/isAuthenticated.middleware.js'
import {
  createOrder,
  getAllSales,
  getBuyerOrders,
  getSellerOrders,
  updateOrderStatus,
} from '../controller/order.controller.js'
import auth from '../middleware/verifyToken.middleware.js'

const router = express.Router()

// router.use(isAuthenticated)
router.use(auth)

router.route('/create-order').post(createOrder)

router.route('/get-seller').get(getSellerOrders)
router.route('/get-buyer').get(getBuyerOrders)
router.route('/update').put(updateOrderStatus)
router.route('/get-sales').get(getAllSales)

export default router
