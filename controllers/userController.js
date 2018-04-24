const UserModel = require('../models/User')
const UserSignUpDocumentationModel = require('../models/UserSignUpDocumentation')
const upload = require('../gridfs.js')

const selfDiagnoses = ['reason1', 'reason2', 'reason3', 'reason4']

exports.user_create_post = function(req, res) {
  upload.upload(req, res, function(err){
    console.log(req.body)
    if(err){
      res.json({error_code:1, err_desc:err});
      return;
    }
    const newUser = new UserModel({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    })
    newUser.save().then((doc)=> {
      let supportingImage = '';
      let supportingReasons = [];
      if(req.files.file2) { //if there is an image for prescription/self diagnoses grab the ID and attach it to the supporting documentation
        supportingImage = req.files.file2[0].id;
      } 
      for (const key in req.body) { //iterate through the keys in the body, if the key is in the selfDiagnoses array then push the key into the supportingReasons array. The Supporting reasons array will be saved into the DB. 
          if(selfDiagnoses.indexOf(key) > -1) {
            supportingReasons.push(key)
          }
      }
      const newUserSignUpDocumentation = new UserSignUpDocumentationModel({
        _id: doc._id,
        govID: req.files.file1[0].id,
        supportingImage: supportingImage,
        supportingReasons: JSON.stringify(supportingReasons)  //stringify because readstream expects a string not an array. We call readstream in order to email the admins a photo containing the supported reasons.
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



