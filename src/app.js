import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import GoogleOAuth from './config/googleAuth.js'

// Routes
import UserRoutes from './routes/user.routes.js'
import ProductRoutes from './routes/product.routes.js'
import CategoryRoutes from './routes/category.routes.js'
import OrderRoutes from './routes/order.routes.js'
import RequestRoutes from './routes/request.routes.js'
import { User } from './models/user.model.js'

const app = express()

// Middleware
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(cookieParser())

// Session configuration with MongoDB store
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
    },
  }),
)

app.use(passport.initialize())
app.use(passport.session())

GoogleOAuth()

passport.serializeUser((user, done) => {
  console.log('ser ', user.user._id)
  done(null, user.user._id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id)
    console.log('dser ', user)
    done(null, user)
  } catch (err) {
    done(err)
  }
})
app.use((req, res, next) => {
  console.log('headers', req.headers.authorization) // Check if token is received
  next()
})

app.use('/api/v1/user', UserRoutes)
app.use('/api/v1/product', ProductRoutes)
app.use('/api/v1/category', CategoryRoutes)
app.use('/api/v1/order', OrderRoutes)
app.use('/api/v1/request', RequestRoutes)

export { app }
