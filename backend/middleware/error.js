const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
      err.statusCode = err.statusCode || 500;
      err.message = err.message || "Internal server error";

      //worng mongodb id error
      if(err.name === 'CastError'){
           const message = `Resource not found Invalid path: ${err.path}`;
           err = new ErrorHandler(message, 404);
      }

      //duplicate key error
      if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message, 404);
      }

      //worng JWT error
      if(err.name === 'JsonWebTokenError'){
        const message = `json web token is invalid, try again`;
        err = new ErrorHandler(message, 404);
       }

      //expire web token
       if(err.name === 'TokenExpiredError'){
        const message = `Jso web token is expired, try again`;
        err = new ErrorHandler(message, 404);
   }

      res.status(err.statusCode).json({
        success: false,
        message: err.message,
        error: err.stack
        
      })
}