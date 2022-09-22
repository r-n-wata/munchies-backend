const plannedMeal = require('../models/plannedMealTemplate')
const jwt_decode = require('jwt-decode');

module.exports = {

     getEventForDate: async (req, res) => {
        const event = {
            date: req.params.datePlanned,
 
         };     

        try{
            const recipes = await plannedMeal.find({ 
                userID: req.user._id,
                datePlanned: event.date
             })
            // const itemsLeft = await Todo.countDocuments({userId:req.user.id,completed: false})
            res.json(recipes)
        }catch(err){
            console.log(err)
        }
   
    },

    getRecipeOfDay: async(req, res) => {

        const event = {
            date: req.params.datePlanned,
     
        };         
    
        try{
            const recipes = await plannedMeal.find({ 
                user: req.user._id,
                datePlanned: event.date
             })
            // const itemsLeft = await Todo.countDocuments({userId:req.user.id,completed: false})
            res.json(recipes)
        }catch(err){
            console.log(err)
        }
    },
    
    addEvent: async(req, res) =>{

        let event = new plannedMeal({
            user: req.user._id,
            recipeID: req.body.recipeID,
            recipeName: req.body.name,
            datePlanned: req.body.date,
            timePlanned: req.body.time,
            image: req.body.image
        })
        try{
            const savedEvent = await event.save()
            console.log(event)
            res.send(savedEvent)
        }catch(err){
            res.status(400).send(err.message)
            console.log(err)
        }
    }

    


}