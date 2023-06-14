const { Router } = require('express')
const router = Router()
const { register, login } = require('../controllers/auth')
const { forgotPassword } = require('../controllers/auth')
const { resetPassword } = require('../controllers/auth')

router.post('/forgot', forgotPassword)
router.post('/register', register)
router.post('/login', login)
router.post('/reset-password/:token', resetPassword);

module.exports = router