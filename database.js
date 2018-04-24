const mongoose = require('mongoose')

class Database {
  constructor() {
    this._connect()
  }

  _connect() {
    mongoose.connect(process.env.DB_URL)
      .then(() => {
        console.log('Database connection success')
      })
      .catch(err => {
        console.error('Database connection error')
    })
  }

  connection() {
    return mongoose.connection;
  }

  mongo() {
    return mongoose.mongo
  }

  db() {
    return mongoose.db
  }
}

module.exports = new Database()
