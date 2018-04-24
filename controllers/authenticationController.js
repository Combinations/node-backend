const UserModel = require('../models/User');
const error = require('../error')

exports.login_post = function(req, res) {
    UserModel.authenticate(req.body.email, req.body.password).then((user) => {
        req.session.userID = user._id;  //set auth session
        res.send({sessionTimeout: Date.now() + 2629800});  //return session timeout for the frontent
    }, (failure) => {
        res.status(failure.code);
        res.send(failure.message);
    })
}

exports.logout_get = function(req, res) {
    if (req.session) {
        req.session.destroy(function(err) { //delete the session
            if (err) {
                res.send(error.internalServerError())
            } else {
                res.send("user logged out")
            }
        });
    }
}



