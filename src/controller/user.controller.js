import { User } from '../models/user.model.js'

const generateUserAccessToken = async (userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = await user.generateAccessToken()

    return { accessToken }
  } catch (error) {
    return res.status(500).json({})
  }
}
export const loginController = async (req, res) => {
  // Successful authentication
  const user = req.user
}
