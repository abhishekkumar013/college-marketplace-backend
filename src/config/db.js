import mongoose from 'mongoose'
import { asyncHandler } from '../uttils/asyncHandler.js'

const DB_NAME = 'CollegeMarketPlace'
const ConnectDb = async () => {
  try {
    const connectiionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}`,
    )
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}
export default ConnectDb
