const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require('../models/userModel');
const sendToken = require("../utils/jwtToken");

//register a User 
exports.registerUser = catchAsyncError(async(req, res, next) => {
     const {name, email, password} = req.body;

     const user = await User.create({
            name, email, password,
            avatar:{
                public_id: "this is sample id",
                url: "profilepicture"
            }
     });

     sendToken(user, 201, res);
});

//Login user
exports.loginUser = catchAsyncError(async(req,res,next) => {
        const {email, password} = req.body;

        // checking if user given both name and password;
        if(!email || !password){
            return next(new ErrorHandler("Please enter email and password", 400));
        }

        const user = await User.findOne({email}).select("+password");

        if(!user){
            return next(new ErrorHandler("Invalid email or password", 401));
        }

        const isPasswordMatched = await user.comparePassword(password);
        
        if(!isPasswordMatched){
            return next(new ErrorHandler("Invalid email or password", 401)); 
        }

        sendToken(user, 200, res);

});

//Logout a user
exports.logoutUser = catchAsyncError(async (req, res, next) =>{
    
      res.cookie('token', null,{
        expires: new Date(Date.now()),
        httpOnly:true,
      }); 
   
      res.status(200).json({
        success: true,
        message:"Logged out",
      });
});