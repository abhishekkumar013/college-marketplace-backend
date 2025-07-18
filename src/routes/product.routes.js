import express from 'express'
import isAuthenticated from '../middleware/isAuthenticated.middleware.js'
import { upload } from '../middleware/multer.middleware.js'
import {
  addProduct,
  deleteProduct,
  getAllMyProduct,
  getAllProduct,
  getLatesProduct,
  getProductByCategory,
  getProductsWithFilters,
  getSingleProduct,
  updateProduct,
  updateSoldOut,
  updateImage,
} from '../controller/product.controller.js'
import auth from '../middleware/verifyToken.middleware.js'

const router = express.Router()

// router.use(isAuthenticated)
router.use(auth)

// Product creation
router.route('/add').post(upload.single('image'), addProduct)

// Product retrieval
router.route('/all').get(getAllProduct)
router.route('/myproduct').get(getAllMyProduct)
router.route('/latest').get(getLatesProduct)
router.route('/products/search').get(getProductsWithFilters)
router.route('/category/:categoryid').get(getProductByCategory)
// router.route('/:productid').get(getSingleProduct)

// Product updates
router.route('/update/:productid').put(updateProduct)
router.route('/update-status/:productid').put(updateSoldOut)
router
  .route('/update-image/:productid')
  .put(upload.single('image'), updateImage)

// Product deletion
router.route('/delete/:productid').delete(deleteProduct)
router.route('/:productid').get(getSingleProduct)

export default router
