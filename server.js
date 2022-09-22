const express = require('express')
const path = require('path')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const passport = require('passport')
// const dotenv = require('dotenv')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('express-flash')
const logger = require('morgan')
const connectDB = require('./config/database')

const userRoutes = require('./routes/userRoutes')
const recipeRoutes = require('./routes/recipesRoutes')
const eventRoutes = require('./routes/eventRoutes')
const { errorHandler } = require('./middlewares/errorMiddleware')
// require('dotenv').config({path: './config/.env'})
const dotenv = require('dotenv').config();
app.use(cors()); 




// dotenv.config();
// Passport config
// require('./config/passport')(passport)

console.log(process.env.NODE_ENV)

connectDB()

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(logger('dev'))

// Sessions
app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
  )
  
 
 
app.use('/api/users', userRoutes)
app.use('/api/recipes', recipeRoutes)
app.use('/api/event', eventRoutes)

// serve frontend
if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname, '../client/build')))

  app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../', 'client', 'build', 'index.html')))
}else{
  app.get('/', (req, res) => res.send('Please set to production'))
}


app.use(errorHandler)

app.listen(process.env.PORT, ()=>{
    console.log('Server is running, you better catch it!')
    
})    