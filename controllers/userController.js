const UserModel = require('../models/User')
const UserSignUpDocumentationModel = require('../models/UserSignUpDocumentation')
const upload = require('../gridfs.js')

exports.user_create_post = function(req, res) {
  upload.upload(req, res, function(err) {
    if (err) {
      res.status(400).send(err)
    }
    const newUser = new UserModel({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    })
    newUser.save().then((doc)=> {
      const newUserSignUpDocumentation = new UserSignUpDocumentationModel({
        _id: doc._id,
        govID: req.files.file1[0].id,
        supportingImage: (req.files.file2 ? req.files.file2[0].id : ''), //if there is an image for prescription/self diagnoses grab the ID and attach it to the supporting documentation
        supportingReasons: (req.body.selfDiagnoses ? req.body.selfDiagnoses : []) //if the user has filled out the self diagnoses tab then assign to supportingReasons
      })
      newUserSignUpDocumentation.save().then((doc)=> {
        res.send({sessionTimeout: req.session.cookie.maxAge}) //return the session timeout if the user is successfully created. The user will also be pushed to the store page. 
      }, (err)=> {
        res.status(400).send(err)
      })
    }, (err)=> {
      res.status(400).send(err)
    })
}); 
}



