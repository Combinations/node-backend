// APPLICATION ERRORS // 

class ExtendableError extends Error {
    constructor(message, code) {
      super(message);
      this.name = this.constructor.name;
      this.code = code;
      this.message = message;
      if (typeof Error.captureStackTrace === 'function') {
        Error.captureStackTrace(this, this.constructor);
      } else { 
        this.stack = (new Error(message)).stack; 
      }
    }
  }    
  
class CustomError extends ExtendableError {
    //GENERAL ERRORS
    internalServerError() {return new ExtendableError({message: "SYSTEM ERROR: internal server error"}, 500)}

    //DATABASE ERRORS
    internalDatabaseError() {return new ExtendableError({message: 'SYSTEM ERROR: internal database error'}, 500)}

    //AUTHENTICATION ERRORS
    userIsNotAuthenticated() {return new ExtendableError({message: 'AUTH ERROR: user is not authenticated'}, 401)}

    //USER MODEL ERRORS
    emailDoesNotExist() {return new ExtendableError({message: 'LOGIN ERROR: invalid email or password'}, 401)}
    incorrectPassword() {return new ExtendableError({message: 'LOGIN ERROR: invalid email or password'}, 401)}
}

module.exports = new CustomError();

