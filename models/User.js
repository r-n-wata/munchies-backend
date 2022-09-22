const mongoose = require('mongoose')


const userTemplate = new mongoose.Schema({
    name: {
        type: String,
        required: false,
      
    },
    email: {
        type: String,
        required: true,
        unique:true,
        
    },
    password: {
        type: String,
        required: true,
    
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('User', userTemplate)