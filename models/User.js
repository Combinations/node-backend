const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const timestampPlugin = require('./plugins/timestamp')
const uniqueValidator = require('mongoose-unique-validator')
const error = require('../error.js');
const nodemailer = require('nodemailer');


// USER SCHEMA //
const userSchema = new mongoose.Schema({
  username: {
    type: String, 
    unique: true,
    required: true,
    lowercase: true,
    trim: true
  }, 
  email: {
    type: String, 
    unique: true, 
    required: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(value) {
        return validator.isEmail(value)
      },
      message: "{VALUE} is not a valid email address"
    }
  },
  password: {
    type: String,
    required: true
  }
})

// PLUGINS //
userSchema.plugin(timestampPlugin)

//uniqueValidator is used so that we can attach error messages to the unique fields as if it were any other field. 
userSchema.plugin(uniqueValidator, {message: "{VALUE} is already taken"})

// HOOKS //

//hash the user password before inserting into db
userSchema.pre('save', function(next) {
  bcrypt.hash(this.password, 10).then((hash)=> {
    this.password = hash
    next();
  }, (err) => {
    next();
  })
})

userSchema.post('save', function(user) {
  console.log('%s has been saved', user);
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SENDER_EMAIL, // generated ethereal user
        pass: process.env.SENDER_EMAIL_PASSWORD // generated ethereal password
    }
  });

  let mailOptions = {
    from: '"James" <jamesleahy314@gmail.com>', // sender address
    to: user.email, // list of receivers
    subject: 'Welcome to <Name>!', // Subject line
    text: 'We are excited that you ......', // plain text body
    html: '<b>something nice here eventually</b>' // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('New user registration email has been sent: %s', info.messageId);
  });
});

// STATIC METHODS //

userSchema.statics.getUsers = function() {
  return new Promise((resolve, reject) => {
    this.find((err, docs) => {
      if(err) {
        return reject(err)
      }
    resolve(docs)
    })
  })
}

//get a user by ID
userSchema.statics.getUser = function (userID) {
  return new Promise((resolve, reject) => {
    this.findOne({_id: userID}).then((user) => {
      resolve(user)
      },
       (err)=>{
        reject(err)
      })
  })
}

userSchema.statics.authenticate = function (email, password) {
  return new Promise((resolve, reject)=> {
    this.findOne({email: email}).then((user) => {
      if(!user) {  //could not find an existing user with the provided email 
        reject(error.emailDoesNotExist())  
      } else {
        bcrypt.compare(password, user.password).then((result) => {
          if(result === true) {
            resolve(user)
          }
          reject(error.incorrectPassword())
        })
      }
      })
      .catch(err =>{
        reject(error.internalDatabaseError())
    }) 
  })
}

module.exports = mongoose.model('User', userSchema)
