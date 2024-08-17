import express from 'express'
import isAuthenticated from '../middleware/isAuthenticated.middleware.js'
import { upload } from '../middleware/multer.middleware.js'
import {
  addProduct,
  deleteProduct,
  getAllProduct,
  getLatesProduct,
  getProductByCategory,
  getSingleProduct,
  updateProduct,
} from '../controller/product.controller.js'

const router = express.Router()

router.use(isAuthenticated)
router.route('/add').post(upload.single('image'), addProduct)
router.route('/update/:productid').put(updateProduct)
router.route('/delete/:productid').delete(deleteProduct)
router
  .route('/update-image/:productid')
  .patch(upload.single('image'), deleteProduct)
router.route('/latest').get(getLatesProduct)
router.route('/all').get(getAllProduct)
router.route('/:productid').get(getSingleProduct)
router.route('/category/:categoryid').get(getProductByCategory)

export default router
