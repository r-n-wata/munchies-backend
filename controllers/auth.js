const passport = require('passport')
const validator = require('validator')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

// exports.postLogin = (req, res, next) => {
//     const validationErrors = []
//     if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' })
//     if (validator.isEmpty(req.body.password)) validationErrors.push({ msg: 'Password cannot be blank.' })
  
//     if (validationErrors.length) {
//       req.flash('errors', validationErrors)
//       return res.redirect('/login')
//     }
//     req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false })
  
//     passport.authenticate('local', (err, user, info) => {
//       if (err) { return next(err) }
//       if (!user) {
//         req.flash('errors', info)
//         return res.redirect('/login')
//       }
//       req.logIn(user, (err) => {
//         if (err) { return next(err) }
//         req.flash('success', { msg: 'Success! You are logged in.' })
//         res.redirect(req.session.returnTo || '/todos')
//       })
//     })(req, res, next)
//   }
  
//   exports.logout = (req, res) => {
//     req.logout(() => {
//       console.log('User has logged out.')
//     })
//     req.session.destroy((err) => {
//       if (err) console.log('Error : Failed to destroy the session during logout.', err)
//       req.user = null
//       res.redirect('/')
//     })
//   }
  
//   exports.getSignup = (req, res) => {
//     if (req.user) {
//       return res.redirect('/todos')
//     }
//     res.render('signup', {
//       title: 'Create Account'
//     })
//   }
  
//   exports.postRegister = (req, res, next) => {
//     const validationErrors = []
//     if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' })
//     if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' })
//     if (req.body.password !== req.body.confirmPassword) validationErrors.push({ msg: 'Passwords do not match' })
  
//     if (validationErrors.length) {
//       req.flash('errors', validationErrors)
//       return res.redirect('../signup')
//     }
//     req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false })
  
//     const user = new User({
//       userName: req.body.userName,
//       email: req.body.email,
//       password: req.body.password
//     })
  
//     User.findOne({$or: [
//       {email: req.body.email},
//       {userName: req.body.userName}
//     ]}, (err, existingUser) => {
//       if (err) { return next(err) }
//       if (existingUser) {
//         req.flash('errors', { msg: 'Account with that email address or username already exists.' })
//         return res.redirect('../signup')
//       }
//       user.save((err) => {
//         if (err) { return next(err) }
//         req.logIn(user, (err) => {
//           if (err) {
//             return next(err)
//           }
//           res.redirect('/todos')
//         })
//       })
//     })
//   }

// exports.postRegister('/register', async(req, res) =>{

//     const { error } = registerValidation(req.body)
//     if(error) return res.status(400).send(error.details[0].message)

//     const emailExists = await User.findOne({ email: req.body.email })
//     if(emailExists)return res.status(400).send('Email already exists')

//     const salt = await bcrypt.genSalt(10);
//     const hashPassword = await bcrypt.hash(req.body.password, salt)

//     const user = new User({
//         name: req.body.name,
//         email: req.body.email,
//         password:hashPassword
//     })

//     try{
//         const savedUser = await user.save()
//         res.send(savedUser)
//     }catch(err){
//         res.status(400).send(err)
//     }
// })


// exports.postLogin('/login', async (req, res)=>{

//     const { error } = loginValidation(req.body)
//     if(error) return res.status(400).send(error.details[0].message)

//     const user = await User.findOne({ email: req.body.email
//     })
//     if(!user)return res.status(400).send('Email is not found')

//     const validPass = await bcrypt.compare(req.body.password, user.password)
//     if(!validPass) return res.status(400).send('Invalid password')

//     // create and assing a token

//     const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)

//     // res.header({'auth-token': token})
//     currentUser = user
//     res.cookie('token', token, { httpOnly: true });
//     res.json({
//         auth : true,
//         token :token,
//         user :user._id,
//         userName : user.name

        
//     })
    

// })

// generate a token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  })
}


module.exports = {

  postRegister: asyncHandler(async(req, res) =>{

    const { name, email, password } = req.body

    if(!name || !email || !password){
      res.status(400)
      throw new Error('Please add all fields')
    }

    // check if user exists

    const userExists = await User.findOne({email})

    if(userExists){
      res.status(400)
      throw new Error('User already exisits')
    }

    // hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // create user
    const user = await User.create({
      name,
      email,
      password:hashedPassword
    })

    if(user){
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      })
    }else{
      res.status(400)
      throw new Error('Invalid user data')
    }

  }),

  postLogin: asyncHandler(async(req, res) =>{
    const {email, password} = req.body

    // check for user email
    const user = await User.findOne({email})

    if(user && (await bcrypt.compare(password, user.password))){
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        // password:user.password,
        token: generateToken(user._id)
      })
    }else{
      res.status(400)
      throw new Error('Invalid credentials')
    }
    res.json({ message: 'login user'})
  }),



  // @access  Private
  getUserData:  asyncHandler(async(req, res) =>{
    const { _id, name, email } = await User.findById(req.user.id)

    res.status(200).json({
      id:_id,
      name,
      email
    })
  }),
}