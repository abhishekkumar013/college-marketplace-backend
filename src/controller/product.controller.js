import mongoose from 'mongoose'
import { Category } from '../models/category.model.js'
import { Product } from '../models/product.model.js'
import { ApiResponse } from '../uttils/ApiResponse.js'
import { asyncHandler } from '../uttils/asyncHandler.js'
import { uploadonCloudinary } from '../uttils/cloudinnary.js'
import { User } from '../models/user.model.js'
import { ErrorHandler } from '../uttils/errorhandler.middleware.js'

export const addProduct = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user._id
    // console.log(req.user)
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

    if (!req.user.phone || !req.user.hostel) {
      throw new ErrorHandler('Update Phone & Hostel', 400)
    }

    if (name.length > 40) {
      throw new ErrorHandler('Product name cannot exceed 40 characters', 400)
    }
    const illegalProductRegex = /^(?:\s*marijuana\s*|\s*cocaine\s*|\s*heroin\s*|\s*LSD\s*|\s*methamphetamine\s*|\s*opioids\s*|\s*ecstasy\s*|\s*fentanyl\s*|\s*crack\s*|\s*PCP\s*|\s*ketamine\s*|\s*quaaludes\s*|\s*xanax\s*|\s*adderall\s*|\s*morphine\s*|\s*DMT\s*|\s*spice\s*|\s*MDMA\s*|\s*methadone\s*|\s*oxycodone\s*|\s*percocet\s*|\s*vicodin\s*|\s*rohypnol\s*|\s*peyote\s*|\s*nitrous\s*|\s*krokodil\s*|\s*flakka\s*|\s*ganja\s*|\s*charas\s*|\s*bhang\s*|\s*cannabis\s*|\s*psychotropic\s*|\s*narcotic\s*|\s*prescription\s*drug\s*|\s*firearm\s*|\s*weapon\s*|\s*explosive\s*|\s*hazardous\s*material\s*|\s*endangered\s*species\s*|\s*ivory\s*|\s*wildlife\s*product\s*)/i

    if (illegalProductRegex.test(name) || illegalProductRegex.test(desc)) {
      throw new ErrorHandler(
        'Product contains illegal or restricted items',
        400,
      )
    }

    const alcoholTobaccoRegex = /^(?:\s*alcohol\s*|\s*beer\s*|\s*wine\s*|\s*liquor\s*|\s*vodka\s*|\s*whiskey\s*|\s*rum\s*|\s*tequila\s*|\s*champagne\s*|\s*budweiser\s*|\s*heineken\s*|\s*jack\s*daniels\s*|\s*smirnoff\s*|\s*bacardi\s*|\s*absolut\s*|\s*johnnie\s*walker\s*|\s*chivas\s*|\s*grey\s*goose\s*|\s*jameson\s*|\s*hennessy\s*|\s*glenfiddich\s*|\s*captain\s*morgan\s*|\s*jägermeister\s*|\s*gin\s*|\s*brandy\s*|\s*cognac\s*|\s*lager\s*|\s*ale\s*|\s*bourbon\s*|\s*scotch\s*|\s*rosé\s*|\s*prosecco\s*|\s*sake\s*|\s*sangria\s*|\s*zinfandel\s*|\s*riesling\s*|\s*chardonnay\s*|\s*aperol\s*|\s*vermouth\s*|\s*daru\s*|\s*pauua\s*|\s*tharra\s*|\s*desi\s*daru\s*|\s*patiala\s*|\s*cigarettes\s*|\s*cigars\s*|\s*tobacco\s*|\s*nicotine\s*|\s*vape\s*|\s*hookah\s*|\s*shisha\s*|\s*marlboro\s*|\s*camel\s*|\s*winston\s*|\s*dunhill\s*|\s*newport\s*|\s*kool\s*|\s*snuff\s*|\s*cigarillos\s*|\s*beedi\s*|\s*chillum\s*|\s*paan\s*)/i

    if (alcoholTobaccoRegex.test(name) || alcoholTobaccoRegex.test(desc)) {
      throw new ErrorHandler(
        'Product contains illegal or restricted items',
        400,
      )
    }

    // const userdetail = await User.findById(userId)

    // if (!userdetail.phone || !userdetail.hostel) {
    //   throw new ErrorHandler('Update Phone & Hostel', 400)
    // }

    if (mrp <= 0) {
      throw new ErrorHandler('MRP must be greater than 0', 401)
    }

    if (
      !name ||
      !quantity ||
      !mrp ||
      discount === undefined ||
      additionalCharge === undefined ||
      finalPrice === undefined
    ) {
      throw new ErrorHandler('All fields are required', 404)
    }
    if (!category) {
      throw new ErrorHandler('Category is required', 404)
    }

    const category_exist = await Category.findById(category)
    if (!category_exist) {
      throw new ErrorHandler('Category Not Exists', 404)
    }
    const calculatedFinalPrice =
      parseFloat(mrp) -
      (parseFloat(mrp) * parseFloat(discount)) / 100 +
      parseFloat(additionalCharge || 0)

    // calculatedFinalPrice = parseFloat(calculatedFinalPrice.toFixed(2));

    if (calculatedFinalPrice <= 1) {
      throw new ErrorHandler('Final Price must be greater than 0', 401)
    }

    const productImageLocalPath = req.file?.path
    // console.log('local path:', productImageLocalPath)
    if (!productImageLocalPath) {
      throw new ErrorHandler('Product Image Required', 404)
    }

    const productImage = await uploadonCloudinary(productImageLocalPath)
    // console.log('Cloudinary response:', productImage)
    if (!productImage || !productImage?.url) {
      throw new ErrorHandler('Error in uploading Product Image', 404)
    }

    // const finalPrice = parseFloat(mrp) - (parseFloat(mrp) * parseFloat(discount) / 100) + parseFloat(additionalCharge || 0);

    // console.log('About to create product with data:', {
    //   name,
    //   image: productImage.url,
    //   category,
    //   quantity: parseInt(quantity),
    //   desc,
    //   seller: userId,
    //   mrp: parseFloat(mrp),
    //   discount: parseFloat(discount),
    //   additionalCharge: parseFloat(additionalCharge),
    //   finalPrice,
    // })

    const product = await Product.create({
      name,
      image: {
        publicId: productImage.public_id,
        url: productImage.secure_url,
      },
      category,
      quantity: parseInt(quantity),
      desc:desc ||'',
      seller: userId,
      mrp: parseFloat(mrp),
      discount: parseFloat(discount),
      additionalCharge: parseFloat(additionalCharge),
      finalPrice:  parseFloat(calculatedFinalPrice.toFixed(2)),
    })

    // console.log('Created product:', product)

    if (!product) {
      throw new ErrorHandler('Error in creating Product', 400)
    }

    return res
      .status(200)
      .json(new ApiResponse(200, product, 'Product Created Successfully'))
  } catch (error) {
    // console.error('Error in addProduct:', error)
    next(error)
  }
})

export const updateProduct = asyncHandler(async (req, res, next) => {
  try {
    const { productid } = req.params

    const {
      name,
      quantity,
      desc,
      mrp,
      discount,
      additionalCharge,
      finalPrice,
    } = req.body

    if (
      !name ||
      name.trim() === '' ||
      quantity === undefined ||
      quantity === '' ||
      !desc ||
      desc.trim() === '' ||
      mrp === undefined ||
      mrp === '' ||
      discount === undefined ||
      discount === '' ||
      additionalCharge === undefined ||
      additionalCharge === ''
    ) {
      throw new ErrorHandler('All fields are required', 400)
    }

    // Find the product by ID

    const product = await Product.findById(productid)

    if (!product) {
      throw new ErrorHandler('Product Not Found', 404)
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productid,
      {
        $set: {
          name,
          quantity,
          desc,
          mrp,
          discount,
          additionalCharge,
          finalPrice,
        },
      },
      { new: true, runValidators: true },
    )

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedProduct, 'Product updated successfully'),
      )
  } catch (error) {
    next(error)
  }
})

export const updateSoldOut = asyncHandler(async (req, res, next) => {
  try {
    const { productid } = req.params

    const product = await Product.findById(productid)

    if (!product) {
      throw new ErrorHandler('No Product Found', 404)
    }
    product.isSold = !product.isSold
    await product.save()

    return res
      .status(200)
      .json(
        new ApiResponse(200, product, 'Product status updated successfully'),
      )
  } catch (error) {
    next(error)
  }
})
export const deleteProduct = asyncHandler(async (req, res, next) => {
  try {
    const { productid } = req.params

    const product = await Product.findById(productid)

    if (!product) {
      throw new ErrorHandler('No Product Found', 404)
    }
    await Product.findByIdAndDelete(productid)

    return res
      .status(200)
      .json(new ApiResponse(200, {}, 'Product Deleted Successfully'))
  } catch (error) {
    next(error)
  }
})

export const updateImage = asyncHandler(async (req, res, next) => {
  try {
    const { productid } = req.params
    console.log('prd', productid)

    const existingproduct = await Product.findById(productid)

    if (!existingproduct) {
      throw new ErrorHandler('No Product Found', 404)
    }
    const productImageLocalPath = req.file?.path
    if (!productImageLocalPath) {
      throw new ErrorHandler('Product Image Reequired', 400)
    }
    const oldPublicId = existingproduct.image.publicId
    if (oldPublicId) {
      await cloudinary.uploader.destroy(oldPublicId)
    }
    const productImage = await uploadonCloudinary(productImageLocalPath)
    if (!productImage || !productImage?.url) {
      throw new ErrorHandler('Error in uploading Product Image', 400)
    }

    const product = await Product.findByIdAndUpdate(
      productid,
      {
        image: {
          publicId: productImage.public_id,
          url: productImage.secure_url,
        },
      },
      { new: true },
    )
    if (!product) {
      throw new ErrorHandler('Error in Image Updation', 400)
    }
    return res
      .status(200)
      .json(new ApiResponse(200, product, 'Image Upddated Successfully'))
  } catch (error) {
    next(error)
  }
})

export const getLatesProduct = asyncHandler(async (req, res, next) => {
  try {
    const latestProducts = await Product.aggregate([
      {
        $match: {
          isSold: false,
          quantity: { $gt: 0 },
        },
      },
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
        $lookup: {
          from: 'users',
          localField: 'seller',
          foreignField: '_id',
          as: 'sellerDetails',
        },
      },
      {
        $unwind: '$sellerDetails',
      },
      {
        $addFields: {
          category: '$categoryDetails.name',
          sellerName: '$sellerDetails.displayName',
          phone: '$sellerDetails.phone',
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
          sellerName: 1,
          phone: 1,
          mrp: 1,
          discount: 1,
          additionalCharge: 1,
          finalPrice: 1,
          isSold: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ])

    res
      .status(200)
      .json(new ApiResponse(200, latestProducts, 'Latest products fetched'))
  } catch (error) {
    next(error)
  }
})
// export const getAllProduct = asyncHandler(async (req, res, next) => {
//   try {
//     const products = await Product.aggregate([
//       {
//         $match: { isSold: false },
//       },
//       {
//         $lookup: {
//           from: 'categories',
//           localField: 'category',
//           foreignField: '_id',
//           as: 'categoryDetails',
//         },
//       },
//       {
//         $unwind: '$categoryDetails',
//       },
//       {
//         $lookup: {
//           from: 'users',
//           localField: 'seller',
//           foreignField: '_id',
//           as: 'sellerDetails',
//         },
//       },
//       {
//         $unwind: '$sellerDetails',
//       },
//       {
//         $addFields: {
//           category: '$categoryDetails.name',
//           sellerName: '$sellerDetails.displayName',
//           phone: '$sellerDetails.phone',
//         },
//       },
//       {
//         $project: {
//           name: 1,
//           image: 1,
//           category: 1,
//           quantity: 1,
//           desc: 1,
//           seller: 1,
//           sellerName: 1,
//           phone: 1,
//           mrp: 1,
//           discount: 1,
//           additionalCharge: 1,
//           finalPrice: 1,
//           isSold: 1,
//           createdAt: 1,
//           updatedAt: 1,
//         },
//       },
//     ])

//     return res
//       .status(200)
//       .json(new ApiResponse(200, products, 'All Products Fetched'))
//   } catch (error) {
//     next(error)
//   }
// })
export const getAllProduct = asyncHandler(async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1 // Current page number (default to 1)
    const limit = parseInt(req.query.limit) || 8 // Number of products per page (default to 8)
    const skip = (page - 1) * limit // Calculate the number of documents to skip

    const products = await Product.aggregate([
      {
        $match: {
          isSold: false,
          quantity: { $gt: 0 },
        },
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
        $lookup: {
          from: 'users',
          localField: 'seller',
          foreignField: '_id',
          as: 'sellerDetails',
        },
      },
      {
        $unwind: '$sellerDetails',
      },
      {
        $addFields: {
          category: '$categoryDetails.name',
          sellerName: '$sellerDetails.displayName',
          phone: '$sellerDetails.phone',
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
          sellerName: 1,
          phone: 1,
          mrp: 1,
          discount: 1,
          additionalCharge: 1,
          finalPrice: 1,
          isSold: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ])

    const totalProducts = await Product.countDocuments({ isSold: false }) // Count total available products

    const hasMore = page * limit < totalProducts

    return res.status(200).json({
      success: true,
      data: products,
      message: 'Products fetched successfully',
      pagination: {
        totalProducts,
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        hasMore,
      },
    })
  } catch (error) {
    next(error)
  }
})
export const getSingleProduct = asyncHandler(async (req, res, next) => {
  try {
    const { productid } = req.params

    if (!productid) {
      throw new ErrorHandler('Product ID is required', 400)
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
        $lookup: {
          from: 'users',
          localField: 'seller',
          foreignField: '_id',
          as: 'sellerDetails',
        },
      },
      { $unwind: '$sellerDetails' },
      {
        $addFields: {
          category: '$categoryDetails.name',
          sellerName: '$sellerDetails.displayName',
          phone: '$sellerDetails.phone',
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
          sellerName: 1,
          phone: 1,
          mrp: 1,
          discount: 1,
          additionalCharge: 1,
          finalPrice: 1,
          isSold: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ])

    if (!product.length) {
      throw new ErrorHandler('Product not found', 404)
    }

    return res
      .status(200)
      .json(new ApiResponse(200, product[0], 'Product fetched successfully'))
  } catch (error) {
    next(error)
  }
})
export const getProductByCategory = asyncHandler(async (req, res, next) => {
  try {
    const { categoryid } = req.body
    if (!categoryid) {
      throw new ErrorHandler('Category Not received', 404)
    }
    const category_exist = await Category.findById(categoryid)
    if (!category_exist) {
      throw new ErrorHandler('Category Not Exists', 404)
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
        $match: {
          'productdetails.isSold': false,
          'productdetails.quantity': { $gt: 0 },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'productdetails.seller',
          foreignField: '_id',
          as: 'sellerDetails',
        },
      },
      {
        $unwind: '$sellerDetails',
      },
      {
        $addFields: {
          'productdetails.category': '$name',
          'productdetails.sellerName': '$sellerDetails.displayName',
          'productdetails.phone': '$sellerDetails.phone',
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
          'productdetails.sellerName': 1,
          'productdetails.phone': 1,
          'productdetails.mrp': 1,
          'productdetails.discount': 1,
          'productdetails.additionalCharge': 1,
          'productdetails.finalPrice': 1,
          'productdetails.isSold': 1,
        },
      },
    ])
    if (!products || products.length === 0) {
      throw new ErrorHandler('No Product found', 404)
    }
    return res.status(200).json(
      new ApiResponse(
        200,
        products.map((p) => p.productdetails),
        'Product fetched successfully',
      ),
    )
  } catch (error) {
    next(error)
  }
})

export const getAllMyProduct = asyncHandler(async (req, res, next) => {
  try {
    console.log(req.user._id)
    const seller = req.user._id

    const allProducts = await Product.find({ seller })

    if (!allProducts || allProducts.length === 0) {
      throw new ErrorHandler('No products found for this seller', 404)
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          allProducts,
          'Seller products fetched successfully',
        ),
      )
  } catch (error) {
    // console.error('Error fetching seller products:', error)
    next(error)
  }
})
// TODO: check categoryid is avillable or not in every controller
// export const getProductsWithFilters = asyncHandler(async (req, res,next) => {
//   try {
//     const { category } = req.query
//     const { keyword } = req.query

//     let query = {}

//     if (category) {
//       query.category = category
//     }

//     if (keyword) {
//       const regex = new RegExp(keyword, 'i')
//       query.$or = [{ name: { $regex: regex } }, { desc: { $regex: regex } }]
//     }

//     if (!category && !keyword) {
//       throw new ErrorHandler(
//         'Either category ID or search keyword is required',
//         400,
//       )
//     }

//     const products = await Product.find(query).populate('category', 'name')

//     if (products.length === 0) {
//       new ErrorHandler('No products found matching the criteria', 404)
//     }

//     let message = 'Products found successfully'
//     if (category && keyword) {
//       message = 'Products found for the specified category and search keyword'
//     } else if (category) {
//       message = 'All products fetched for this category'
//     } else if (keyword) {
//       message = 'Products found matching the search keyword'
//     }

//     return res.status(200).json(new ApiResponse(200, products, message))
//   } catch (error) {
//     // console.error('Error in getProductsWithFilters:', error)
//     throw new ErrorHandler('Error while fetching products', 500)
//   }
// })

export const getProductsWithFilters = asyncHandler(async (req, res, next) => {
  try {
    const { category, hostel, keyword } = req.query

    let query = { isSold: false, quantity: { $gt: 0 } }
    let userIds = []

    if (hostel) {
      // Find all users from the same hostel
      const hostelUsers = await User.find({ hostel })
      userIds = hostelUsers.map((user) => user._id)
      query.seller = { $in: userIds }
    }

    if (category) {
      query.category = category
    }

    if (keyword) {
      const regex = new RegExp(keyword, 'i')
      query.$or = [{ name: { $regex: regex } }, { desc: { $regex: regex } }]
    }

    if (!category && !keyword && !hostel) {
      throw new ErrorHandler(
        'Either category ID, hostel, or search keyword is required',
        400,
      )
    }

    const products = await Product.find(query)
      .populate('category', 'name')
      .populate('seller', 'displayName')

    // console.log(products)

    // if (products.length === 0) {
    //   throw new ErrorHandler('No products found matching the criteria', 404)
    // }

    let message = 'Products found successfully'
    if (hostel && category && keyword) {
      message =
        'Products found for the specified hostel, category, and search keyword'
    } else if (hostel && category) {
      message = 'Products found for the specified hostel and category'
    } else if (hostel && keyword) {
      message =
        'Products found for the specified hostel matching the search keyword'
    } else if (hostel) {
      message = 'All products fetched for this hostel'
    } else if (category && keyword) {
      message = 'Products found for the specified category and search keyword'
    } else if (category) {
      message = 'All products fetched for this category'
    } else if (keyword) {
      message = 'Products found matching the search keyword'
    }

    return res.status(200).json(new ApiResponse(200, products, message))
  } catch (error) {
    next(error)
  }
})

// export const getProductsWithFilters = asyncHandler(async (req, res, next) => {
//   try {
//     const { category, hostel, keyword } = req.query

//     let query = {}

//     if (hostel) {
//       const hostelUsers = await User.find({
//         hostel: { $regex: new RegExp('^' + hostel + '$', 'i') },
//       })

//       const userIds = hostelUsers.map((user) => user._id)

//       query.seller = { $in: userIds }
//     }

//     if (category) {
//       query.category = category
//     }

//     if (keyword) {
//       const regex = new RegExp(keyword, 'i')
//       query.$or = [{ name: { $regex: regex } }, { desc: { $regex: regex } }]
//     }

//     if (!category && !keyword && !hostel) {
//       throw new ErrorHandler(
//         'Either category ID, hostel, or search keyword is required',
//         400,
//       )
//     }

//     const products = await Product.find(query)
//       .populate('category', 'name')
//       .populate({
//         path: 'seller',
//         select: 'displayName hostel',
//         match: hostel
//           ? { hostel: { $regex: new RegExp('^' + hostel + '$', 'i') } }
//           : {},
//       })

// TODO
// Filter out products where seller is null (in case the hostel didn't match in population)
//     const filteredProducts = products.filter(
//       (product) => product.seller !== null,
//     )

//     if (filteredProducts.length === 0) {
//       throw new ErrorHandler('No products found matching the criteria', 404)
//     }

//     let message = 'Products found successfully'
//     if (hostel && category && keyword) {
//       message =
//         'Products found for the specified hostel, category, and search keyword'
//     } else if (hostel && category) {
//       message = 'Products found for the specified hostel and category'
//     } else if (hostel && keyword) {
//       message =
//         'Products found for the specified hostel matching the search keyword'
//     } else if (hostel) {
//       message = 'All products fetched for this hostel'
//     } else if (category && keyword) {
//       message = 'Products found for the specified category and search keyword'
//     } else if (category) {
//       message = 'All products fetched for this category'
//     } else if (keyword) {
//       message = 'Products found matching the search keyword'
//     }

//     return res.status(200).json(new ApiResponse(200, filteredProducts, message))
//   } catch (error) {
//     next(error)
//   }
// })

// -------------------------------
// export const getByCategory = asyncHandler(async (req, res,next) => {
//   try {
//     const { categoryId } = req.params
//     if (!categoryId) {
//       return res
//         .status(400)
//         .json(new ApiResponse(400, null, 'Category id required'))
//     }
//     const products = await Product.find({ category: categoryId })

//     if (!products || products.length === 0) {
//       return res
//         .status(404)
//         .json(new ApiResponse(404, null, 'No products found'))
//     }
//     return res
//       .status(200)
//       .json(
//         new ApiResponse(
//           200,
//           products,
//           'All products fetched for this category',
//         ),
//       )
//   } catch (error) {
//     return res
//       .status(500)
//       .json(new ApiResponse(500, null, 'Error in get by category'))
//   }
// })
// export const searchProductsByName = asyncHandler(async (req, res,next) => {
//   try {
//     const { keyword } = req.query

//     if (!keyword) {
//       return res
//         .status(400)
//         .json(new ApiResponse(400, null, 'Search keyword is required'))
//     }

//     const regex = new RegExp(keyword, 'i')

//     const products = await Product.find({
//       $or: [{ name: { $regex: regex } }, { desc: { $regex: regex } }],
//     }).populate('category', 'name')

//     if (products.length === 0) {
//       return res
//         .status(404)
//         .json(
//           new ApiResponse(
//             404,
//             null,
//             'No products found matching the search keyword',
//           ),
//         )
//     }

//     return res
//       .status(200)
//       .json(new ApiResponse(200, products, 'Products found successfully'))
//   } catch (error) {
//     console.error('Error in searchProductsByName:', error)
//     return res
//       .status(500)
//       .json(new ApiResponse(500, null, 'Error while searching for products'))
//   }
// })
