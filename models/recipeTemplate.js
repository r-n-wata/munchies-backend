const mongoose = require('mongoose')


const recipeTemplate = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    ingredients: {
        type: Array,
        required: true,
        min: 6,
    },
    name: {
        type: String,
        required: true,
        min: 4
    },
    servings: {
        type: Number,
        min: 6
    },
    
    category: {
        type: String,
        min: 6,
    },
    dietary: {
        type: String,
        required: true,
        min: 4
    },
    image: {
        type: String,
        min: 6
    },
    method: {
        type: Array,
        required: true,
        min: 6,
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Recipe', recipeTemplate)

