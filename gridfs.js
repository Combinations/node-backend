
//dependencies for file uploads
const multer = require('multer'); //middleware for handling multipart/form-data
const GridFsStorage = require('multer-gridfs-storage');   //gridFs is used to store files in mongodb
const Grid = require('gridfs-stream');  //simpiler streaming
var mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const storage = new GridFsStorage({
    url: process.env.DB_URL,
    file: (req, file) => {
        return {
            bucketName: "fronttest",
            filename: 'file_' + Date.now()
        };
    }
});

let gfs;
const conn = mongoose.createConnection(process.env.DB_URL);

conn.once('open', function () {
    console.log("Database file connection success")
    gfs = Grid(conn.db, mongoose.mongo);
})

exports.sendAccountCreatedEmail = function(user, document) {

    user.password = ''  //clear user password, no need to send to admin 

    let attachments = [];   //attachments for the email

    //create a readstream for the gov ID and attach the content
    govIDOptions = {_id: document.govID, root: "fronttest", mode: 'r'}
    const govIDstream = gfs.createReadStream(govIDOptions);
    attachments[0] = {filename: 'govID.jpg', content: govIDstream}

    //check whether the supporting reason is an image of a prescription/dispensary card or if it is a self diagnoses
    if(document.supportingImage !== '') {
        reasonDataOptions = {_id: document.supportingImage, root: "fronttest", mode: 'r'}  
        const reasonDatastream = gfs.createReadStream(reasonDataOptions);
        attachments[1] = {filename: 'Prescription|card.jpg', content: reasonDatastream} //attach the image data
    }
    if(document.supportingReasons !== []) {
        attachments[2] = {filename: 'self diagnoses.txt', content: document.supportingReasons}   //in the case of self diagnoses we have a string of symptoms
    }

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SENDER_EMAIL, // email address that the email will be sent from
            pass: process.env.SENDER_EMAIL_PASSWORD //password that the email will be sent from
        }
      });
    
      let mailOptions = {
        from: '"James" <email@gmail.com>', // sender address
        to: 'email@gmail.com', // list of receivers
        subject: 'A new user has signed up!', // Subject line
        html: JSON.stringify(user), // html body
        attachments: attachments
      };
    
      //send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Supporting documentation email sent: %s', info.messageId);
      });
}

//initalize multer for file uploads
exports.upload = multer({ storage: storage}).fields([{name: "file1", maxCount: 1}, {name: "file2", maxCount: 1}])
  
