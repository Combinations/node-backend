const express = require('express')
const middleware = require('../middleware')
const router = express.Router();

// controller modules
const user_controller = require('../controllers/userController');

//add middleware to routes
router.use(middleware.logger, middleware.errorHandler);

//POST request for creating a User.
router.post('/create', user_controller.user_create_post);

module.exports = router;
