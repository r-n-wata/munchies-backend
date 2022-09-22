const Recipe = require('../models/recipeTemplate')
const jwt_decode = require('jwt-decode');
const User = require('../models/User')

module.exports= {
    

    getRecipes: async (req,res)=>{
        // const id = req.params.user; 
        console.log(req.user)
        try{
            const recipes = await Recipe.find({ user: req.user._id })
            // const itemsLeft = await Todo.countDocuments({userId:req.user.id,completed: false})
            res.json(recipes)
            console.log(recipes)
        }catch(err){
            console.log(err)
        }
    },

    getRecipesByName: async (req, rex) => {

        const name = req.params.name; 
        console.log(req.user)
        try{
            const recipes = await Recipe.find({ name:name })
            // const itemsLeft = await Todo.countDocuments({userId:req.user.id,completed: false})
            res.json(recipes)
        }catch(err){
            console.log(err)
        }
   
    },

    addRecipe: async(req, res) =>{


        let recipe = new Recipe({
           user: req.user._id,
           name: req.body.name,
           servings: req.body.servings,
           category: req.body.category,
           dietary: req.body.dietary,
           image: req.body.image,
           method: req.body.method,
           ingredients: req.body.ingredients
           
        });
        try{
            const savedRecipe = await recipe.save()
            console.log(recipe)
            res.send(savedRecipe)
        }catch(err){
            res.status(400).send(err.message)
            console.log(err)
        }
    },

    updateRecipe: async(req, res) =>{
        const user = await User.findById(req.user._id)

        const recipe = await Recipe.create({
            user: req.user._id,
            name: req.body.name,
            servings: req.body.servings,
            category: req.body.category,
            dietary: req.body.dietary,
            image: req.body.image,
            method: req.body.method,
            ingredients: req.body.ingredients
        })
        // check for user
        if(!user){
            res.status(401)
            throw new Error('User not found')
        }

        // make sure the logged in user matches the recipe user
        if(recipe.user.toString() !== user._id.toString()){
            res.status(401)
            throw new Error('User not authorised')
        }
        try{
            await Recipe.findByIdAndUpdate({_id:req.params.id}, {
                name: req.body.name,
                servings: req.body.servings,
                category: req.body.category,
                dietary: req.body.dietary,
                image: req.body.image,
                method: req.body.method,
                ingredients: req.body.ingredients
             })
        }catch(err){
            console.log(err)
        }
       
    }
}
