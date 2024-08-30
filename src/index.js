import dotenv from 'dotenv'
import { app } from './app.js'
import ConnectDb from './config/db.js'
import { errorMiddleware } from './uttils/errorhandler.middleware.js'

dotenv.config({
  path: './.env',
})

const PORT = process.env.PORT || 8080

ConnectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server start at  port ${PORT}`)
    })
  })
  .catch((err) => {
    console.log('MONGO ERROR', err)
  })
app.use(errorMiddleware)
