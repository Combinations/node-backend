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
}

module.exports = new Middleware();