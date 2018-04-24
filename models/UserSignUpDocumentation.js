const mongoose = require('mongoose')
const timestampPlugin = require('./plugins/timestamp')
const uniqueValidator = require('mongoose-unique-validator')
const UserModel = require('./User')
const grid = require('../gridfs.js')

// SUPPORTING DOCUMENTATION SCHEMA //
const userSignUpDocumentationSchema = new mongoose.Schema({
  _id: {  //_id matches a user _id. This is how we tie the user's supporting documentation to the correct user. 
    type: String,
    required: true
  },
  govID: {  //a reference to an image of a government issued ID. 
    type: String, 
    required: true,
  },
  supportingImage: {  //a reference to an image of prescription or dispensary card. 
    type: String
  },
  supportingReasons: {  //an array that contains the user's self diagnoses symptoms. 
    type: String
  }
})

// PLUGINS //
userSignUpDocumentationSchema.plugin(timestampPlugin)

//uniqueValidator is used so that we can attach error messages to the unique fields as if it were any other field. 
userSignUpDocumentationSchema.plugin(uniqueValidator, {message: "{VALUE} is already taken"})

//HOOKS
userSignUpDocumentationSchema.post('save', function(document) {
  console.log('%s has been saved', document);
  UserModel.getUser(document._id).then((user)=>{
    grid.sendAccountCreatedEmail(user, document)
  })
  //logic to read files and email people of newly created account
});

// STATIC FUNCTIONS //


module.exports = mongoose.model('UserSignUpDocumentation', userSignUpDocumentationSchema)
