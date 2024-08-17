import mongoose from 'mongoose'
import { Category } from '../models/category.model.js'
import { Product } from '../models/product.model.js'
import { ApiResponse } from '../uttils/ApiResponse.js'
import { asyncHandler } from '../uttils/asyncHandler.js'
import { uploadonCloudinary } from '../uttils/cloudinnary.js'

export const addProduct = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id
    const {
      name,
      category,
      quantity,
      desc,
      mrp,
      discount,
      additionalCharge,
      finalPrice,
    } = req.body

    if (!category) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, 'All fields Required'))
    }

    if (
      [name, quantity, desc, mrp, discount, additionalCharge].some(
        (field) => field?.trim() === '',
      )
    ) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, 'All fields Required'))
    }
    const category_exist = await Category.findById(category)
    if (!category_exist) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, 'Category Not Exists'))
    }
    const productImageLocalPath = req.file?.path
    if (!productImageLocalPath) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, 'Product Image Reequired'))
    }
    const productImage = await uploadonCloudinary(productImageLocalPath)
    if (!productImage || !productImage?.url) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, 'Error in uploading Product Image'))
    }
    const product = await Product.create({
      name,
      image: productImage.url || '',
      category,
      quantity,
      desc,
      seller: userId,
      mrp,
      discount,
      additionalCharge,
      finalPrice: finalPrice || mrp - discount + additionalCharge,
    })
    if (!product) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, 'Error in creating  Product '))
    }
    return res
      .status(200)
      .json(new ApiResponse(200, product, 'Product Created Successfully'))
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponse(500, {}, 'Internal server Error at Product Creation'),
      )
  }
})

export const updateProduct = asyncHandler(async (req, res) => {
  try {
    const { productid } = req.params

    const {
      name,
      category,
      quantity,
      desc,
      mrp,
      discount,
      additionalCharge,
      finalPrice,
    } = req.body

    if (!category) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, 'All fields are required'))
    }
    if (
      [name, quantity, desc, mrp, discount, additionalCharge].some(
        (field) => !field || field.trim() === '',
      )
    ) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, 'All fields are required'))
    }
    const category_exist = await Category.findById(category)
    if (!category_exist) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, 'Category Not Exists'))
    }

    // Find the product by ID
    const product = await Product.findById(productid)
    if (!product) {
      return res.status(404).json(new ApiResponse(404, {}, 'Product Not Found'))
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productid,
      {
        name,
        category,
        quantity,
        desc,
        seller: req.user.Id,
        mrp,
        discount,
        additionalCharge,
        finalPrice: finalPrice || mrp - discount + additionalCharge,
        image: product.image,
      },
      { new: true },
    )

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedProduct, 'Product updated successfully'),
      )
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, {}, 'Error in Product Updation'))
  }
})

export const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const { productid } = req.params

    const product = await Product.findById(productid)

    if (!product) {
      return res.status(404).json(new ApiResponse(404, {}, 'No Product Found'))
    }
    await Product.findByIdAndDelete(productid)

    return res
      .status(200)
      .json(new ApiResponse(200, {}, 'Product Deleted Successfully'))
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, {}, 'Error in Product Deletion'))
  }
})

export const updateImage = asyncHandler(async (req, res) => {
  try {
    const { productid } = req.params

    const existingproduct = await Product.findById(productid)

    if (!existingproduct) {
      return res.status(404).json(new ApiResponse(404, {}, 'No Product Found'))
    }
    const productImageLocalPath = req.file?.path
    if (!productImageLocalPath) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, 'Product Image Reequired'))
    }
    const productImage = await uploadonCloudinary(productImageLocalPath)
    if (!productImage || !productImage?.url) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, 'Error in uploading Product Image'))
    }

    const product = await Product.findByIdAndUpdate(
      productid,
      {
        image: productImage.url,
      },
      { new: true },
    )
    if (!product) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, 'Error in Image Updation'))
    }
    return res
      .status(200)
      .json(new ApiResponse(200, product, 'Image Upddated Successfully'))
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, {}, 'Error in Image Updation'))
  }
})

export const getLatesProduct = asyncHandler(async (req, res) => {
  try {
    const latestProducts = await Product.aggregate([
      {
        $sort: { createdAt: -1 },
      },
      {
        $limit: 10,
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryDetails',
        },
      },
      {
        $unwind: '$categoryDetails',
      },
      {
        $addFields: {
          category: '$categoryDetails.name',
        },
      },
      {
        $project: {
          name: 1,
          image: 1,
          category: 1,
          quantity: 1,
          desc: 1,
          seller: 1,
          mrp: 1,
          discount: 1,
          additionalCharge: 1,
          finalPrice: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ])

    res
      .status(200)
      .json(new ApiResponse(200, latestProducts, 'Latest products fetched'))
  } catch (error) {
    res
      .status(500)
      .json(new ApiResponse(500, {}, 'Error fetching latest products'))
  }
})
export const getAllProduct = asyncHandler(async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryDetails',
        },
      },
      {
        $unwind: '$categoryDetails',
      },
      {
        $addFields: {
          category: '$categoryDetails.name',
        },
      },
      {
        $project: {
          name: 1,
          image: 1,
          category: 1,
          quantity: 1,
          desc: 1,
          seller: 1,
          mrp: 1,
          discount: 1,
          additionalCharge: 1,
          finalPrice: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ])

    return res
      .status(200)
      .json(new ApiResponse(200, products, 'All Products Fetched'))
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, {}, 'Error getting all products'))
  }
})
export const getSingleProduct = asyncHandler(async (req, res) => {
  try {
    const { productid } = req.params

    if (!productid) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, 'Product ID is required'))
    }

    const product = await Product.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(productid) } },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryDetails',
        },
      },
      { $unwind: '$categoryDetails' },
      {
        $addFields: {
          category: '$categoryDetails.name',
        },
      },
      {
        $project: {
          name: 1,
          image: 1,
          category: 1,
          quantity: 1,
          desc: 1,
          seller: 1,
          mrp: 1,
          discount: 1,
          additionalCharge: 1,
          finalPrice: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ])

    if (!product.length) {
      return res.status(404).json(new ApiResponse(404, {}, 'Product not found'))
    }

    return res
      .status(200)
      .json(new ApiResponse(200, product[0], 'Product fetched successfully'))
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, {}, 'Error in getting product'))
  }
})

export const getProductByCategory = asyncHandler(async (req, res) => {
  try {
    const { categoryid } = req.body
    if (!categoryid) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, 'Category Not recieved'))
    }
    const category_exist = await Category.findById(categoryid)
    if (!category_exist) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, 'Category Not Exists'))
    }

    const products = await Category.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(categoryid) },
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'category',
          as: 'productdetails',
        },
      },
      {
        $unwind: '$productdetails',
      },
      {
        $addFields: {
          'productdetails.category': '$name',
        },
      },
      {
        $project: {
          'productdetails.name': 1,
          'productdetails.image': 1,
          'productdetails.quantity': 1,
          'productdetails.category': 1,
          'productdetails.desc': 1,
          'productdetails.seller': 1,
          'productdetails.mrp': 1,
          'productdetails.discount': 1,
          'productdetails.additionalCharge': 1,
          'productdetails.finalPrice': 1,
        },
      },
    ])
    if (!products.length) {
      return res.status(404).json(new ApiResponse(404, {}, 'No Product  found'))
    }
    return res.status(200).json(
      new ApiResponse(
        200,
        products.map((p) => p.productdetails),
        'Product fetched successfully',
      ),
    )
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, {}, 'find by category failed'))
  }
})
// TODO: check categoryid is avillable or not in every controller
