const error = require('./error')

class Middleware {
    //log each request
    logger (req, res, next) {
        console.log('LOGGER: ' + req.originalUrl + " AT " + Date.now())
        next()
    }
    //middleware to require authentication on a route
    requireAuthentication (req, res, next) {
        if(req.session && req.session.userID) {
            next();
        } else {
            next(error.userIsNotAuthenticated())
        }
    }
    //handle middleware errors
    errorHandler(err, req, res, next) {
        res.status(err.code)
        res.send(err.message)
    }

    cors(req, res, next) {
        // url of the front end that we are connecting to
        res.setHeader('Access-Control-Allow-Origin',  process.env.FRONTEND_ORIGIN);
        // allowed request methods
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        // additional request headers
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        // This is set to true so that cookies will be passed. 
        res.setHeader('Access-Control-Allow-Credentials', true);
        next();
    };
    
}

module.exports = new Middleware();