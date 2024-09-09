import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth2'
import { User } from '../models/user.model.js'
import jwt from 'jsonwebtoken'

const GoogleOAuth = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/api/v1/user/auth/google/callback',
        scope: ['profile', 'email', 'openid'],
        passReqToCallback: true,
      },
      async (request, accessToken, refreshToken, profile, done) => {
        try {
          // Validate the user's email domain
          const emailDomain = profile.emails[0].value.split('@')[1]
          if (emailDomain !== 'kiit.ac.in') {
            return done(null, false, { message: 'Use Kiit Email Id For Login' })
          }

          let user = await User.findOne({ googleId: profile.id })

          if (!user) {
            user = new User({
              googleId: profile.id,
              displayName: profile.displayName,
              email: profile.emails[0].value,
              image: profile.photos[0].value,
            })
            await user.save()
          }

          const token = jwt.sign(
            {
              _id: user.id,
              email: user.email,
              displayName: user.displayName,
              phone: user.phone,
              hostel: user.hostel,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: '14d',
            },
          )

          return done(null, { user, token })
        } catch (error) {
          return done(error, null)
        }
      },
    ),
  )
}

export default GoogleOAuth
