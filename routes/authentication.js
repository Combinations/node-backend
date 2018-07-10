const express = require('express')
const middleware = require('../middleware');
const router = express.Router();

// controller modules
const authentication_controller = require('../controllers/authenticationController');

//add middleware to routes
router.use(middleware.logger, middleware.cors, middleware.errorHandler);

//POST request for login
router.post('/login', authentication_controller.login_post);
router.get('/logout', authentication_controller.logout_get);


module.exports = router;