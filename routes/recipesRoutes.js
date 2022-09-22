const router = require('express').Router();
const recipeController = require('../controllers/Recipes')

const { protect } = require('../middlewares/AuthMiddleware')

router.get('/find', protect, recipeController.getRecipes)

router.get('/find/:name', protect, recipeController.getRecipesByName)

router.post('/add', protect, recipeController.addRecipe)

router.put('/update/:id', protect, recipeController.updateRecipe)

module.exports = router