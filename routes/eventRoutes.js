const router = require('express').Router();

const { protect } = require('../middlewares/AuthMiddleware')

const eventsController = require('../controllers/Event')

router.get('/find/:datePlanned', protect, eventsController.getEventForDate)

router.get('/find/recipes-of-the-day/:date', protect, eventsController.getRecipeOfDay)

router.post('/addevent', protect, eventsController.addEvent)

module.exports = router