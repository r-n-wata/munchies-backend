const mongoose = require('mongoose')


const plannedMeal = new mongoose.Schema({
    user:{
        type:String,
        required:true
    },
    recipeID: {
        type: String,
        required: true,
        min: 4
    },
    recipeName: {
        type: String,
        
    },
    datePlanned: {
        type: String,
        required:true,
        
    },
    timePlanned: {
        type: String,
        required: true,
       
    },
    image:{
        type:String,
        required:true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Event', plannedMeal)

