import expreess from 'express'

import cors from 'cors'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import session from 'express-session'
import GoogleOAuth from './config/googleAuth.js'

//

const app = expreess()

// middeleware
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
)

app.use(expreess.json())
app.use(expreess.urlencoded({ extended: true }))
app.use(expreess.static('public'))
app.use(cookieParser())
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  }),
)
// Setup passport
app.use(passport.initialize())
app.use(passport.session())

GoogleOAuth()

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

// routes
import UserRoutes from './routes/user.routes.js'
import ProductRoutes from './routes/product.routes.js'
import CategoryRoutes from './routes/category.routes.js'

app.use('/api/v1/user', UserRoutes)
app.use('/api/v1/product', ProductRoutes)
app.use('/api/v1/category', CategoryRoutes)

export { app }
