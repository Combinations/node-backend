const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')  

//dependencies to support user sessions
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const db = require('./database.js');

//APPLICATION ROUTES
const user = require('./routes/user');
const authentication = require('./routes/authentication');

//START EXPRESS
const app = express();

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());
app.use(cors({origin: process.env.FRONTEND_ORIGIN}))

//SESSION HANDLING SETUP 
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db.connection()
  }),
  cookie: {expires: Date.now() + 2629800}
}));

//APPLICATION ENDPOINTS
app.use('/user', user);
app.use('/authentication', authentication);

//LISTEN 
app.listen(process.env.APP_PORT, function() {
  console.log("listening on " + process.env.APP_PORT)
})