import { Order } from '../models/order.model.js'
import { Product } from '../models/product.model.js'
import { User } from '../models/user.model.js'
import { ApiResponse } from '../uttils/ApiResponse.js'
import { asyncHandler } from '../uttils/asyncHandler.js'

export const createOrder = asyncHandler(async (req, res, next) => {
  try {
    const { seller, product } = req.body
    const buyer = req.user._id

    if (!seller || !product) {
      throw new ErrorHandler('Missing required fields', 400)
    }

    const sellerExist = await User.findById(seller)
    if (!sellerExist) {
      throw new ErrorHandler('Seller not found', 404)
    }

    const productExist = await Product.findById(product)
    if (!productExist) {
      throw new ErrorHandler('Product not found', 404)
    }

    const order = await Order.create({
      seller,
      buyer,
      product,
    })

    return res.status(201).json(new ApiResponse(201, order, 'Order created'))
  } catch (error) {
    // console.error('Error in order creation:', error)
    next(error)
  }
})

export const getSellerOrders = asyncHandler(async (req, res, next) => {
  try {
    const sellerId = req.user._id

    const orders = await Order.find({ seller: sellerId, status: 'pending' })
      .populate('buyer', 'displayName email phone')
      .populate('product', 'name image finalPrice')
      .select('status createdAt updatedAt')

    if (!orders || orders.length === 0) {
      throw new ErrorHandler('No orders found for this seller', 404)
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, orders, 'Seller orders retrieved successfully'),
      )
  } catch (error) {
    next(error)
  }
})

export const getBuyerOrders = asyncHandler(async (req, res, error) => {
  try {
    const buyerId = req.user._id

    const orders = await Order.find({ buyer: buyerId })
      .populate('seller', 'displayName email')
      .populate('product', 'name  image finalPrice')
      .select('status')

    if (!orders || orders.length === 0) {
      throw new ErrorHandler('No orders found for this buyer', 404)
    }

    return res
      .status(200)
      .json(new ApiResponse(200, orders, 'Buyer orders retrieved successfully'))
  } catch (error) {
    next(error)
  }
})
export const getAllSales = asyncHandler(async (req, res, next) => {
  try {
    const sellerId = req.user._id

    const orders = await Order.find({
      seller: sellerId,
      status: { $in: ['delivered'] },
    })
      .populate('buyer', 'displayName email')
      .populate('product', 'name image finalPrice')
      .select('status createdAt')

    if (!orders || orders.length === 0) {
      throw new ErrorHandler(
        'No delivered or cancelled orders found for this buyer',
        404,
      )
    }

    const formattedOrders = orders.map((order) => ({
      ...order.toObject(),
      saleTime: order.createdAt.toISOString().split('T')[0],
    }))

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          formattedOrders,
          'Delivered and cancelled buyer orders retrieved successfully',
        ),
      )
  } catch (error) {
    next(error)
  }
})
export const updateOrderStatus = asyncHandler(async (req, res, next) => {
  try {
    // const { orderId } = req.params
    const { status, orderId } = req.body

    if (!orderId || !status) {
      throw new ErrorHandler('Missing required fields', 400)
    }

    const order = await Order.findById(orderId)

    if (!order) {
      throw new ErrorHandler('Order not found', 404)
    }

    if (!['pending', 'delivered', 'cancelled'].includes(status)) {
      throw new ErrorHandler('Invalid status', 400)
    }

    order.status = status
    await order.save()

    return res
      .status(200)
      .json(new ApiResponse(200, order, 'Order status updated successfully'))
  } catch (error) {
    next(error)
  }
})
