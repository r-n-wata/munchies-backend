const router = require('express').Router();
const User = require('../models/User')
const authController = require('../controllers/auth')

const { protect } = require('../middlewares/AuthMiddleware')

router.post('/register', authController.postRegister)

router.post('/login', authController.postLogin)

router.get('/me', protect, authController.getUserData)



module.exports = router