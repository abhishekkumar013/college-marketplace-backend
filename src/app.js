import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import GoogleOAuth from './config/googleAuth.js'
import MongoStore from 'connect-mongo'
import { MongoClient } from 'mongodb'
import session from 'express-session'

// Routes
import UserRoutes from './routes/users.routes.js'
import ProductRoutes from './routes/product.routes.js'
import CategoryRoutes from './routes/category.routes.js'
import OrderRoutes from './routes/order.routes.js'
import RequestRoutes from './routes/request.routes.js'
import { User } from './models/user.model.js'

const app = express()

// Middleware
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://kiitmart.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(cookieParser())

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL,
      ttl: 14 * 24 * 60 * 60,
    }),
    cookie: {
      maxAge: 14 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'none',
    },
  }),
)

// Initialize passport
app.use(passport.initialize())

GoogleOAuth()

passport.serializeUser((userObject, done) => {
  done(null, userObject.user._id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id)
    done(null, user)
  } catch (error) {
    done(error, null)
  }
})

app.use('/api/v1/user', UserRoutes)
app.use('/api/v1/product', ProductRoutes)
app.use('/api/v1/category', CategoryRoutes)
app.use('/api/v1/order', OrderRoutes)
app.use('/api/v1/request', RequestRoutes)

export { app }
