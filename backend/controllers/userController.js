const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require('../models/userModel');
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");

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

// //forgot password
exports.forgotPassword = catchAsyncError(async(req, res, next) =>{
    const user = await User.findOne({email: req.body.email});

    if(!user){
      return next(new ErrorHandler("User not exist", 404))
    }

    //Get reset password token
    const resetToken = await user.getPasswordResetToken();

    await user.save({validateBeforeSave:false});

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset link :- \n\n ${resetPasswordUrl} \n\nif you are not requested this email pls ignore it`;

    try {

      await sendEmail({
          email: user.email,
          subject: `email password recovery`,
          message,

      });

      res.status(200).json({
        success: true,
        message:`Message sent to ${user.email} successfully`,
      });
      
    } catch (error) {
       user.resetPasswordToken = undefined;
       user.resetPasswordExpire = undefined;

       await user.save({validateBeforeSave:false});

       return next(new ErrorHandler(error.message, 500));
    }
});