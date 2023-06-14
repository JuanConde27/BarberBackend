const express = require('express')
const dbConnection = require('../db/connectDB')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const port = process.env.PORT || 3000

class Server {
  constructor() {
    this.app = express()

    this.connectDB()
    this.middlewares()
    this.routes()
    this.showMessage()

  }

  showMessage() {
    this.app.get('/', (req, res) => {
      res.send('Este servirdor esta online!')
    })
  }

  connectDB() {
    dbConnection()
  }

  middlewares() {
    this.app.use(express.json())
    this.app.use(cookieParser())
    this.app.use(cors({
      origin: '*'
    }))
  }

  routes() {
    this.app.use('/api', require('../routes/auth.routes'))
    this.app.use('/api', require('../routes/booking.routes'))
    this.app.use('/api', require('../routes/barbers.routes'))
    this.app.use('/api', require('../routes/users.routes'))
    this.app.use('/api', require('../routes/admin.routes'))
  }

  listen() {
    this.app.listen(port, () => {
      console.log(`Server running on port ${port}`)
    })
  }
}

module.exports = Server
