const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require('../models/userModel');
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require('crypto');

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

//forgot password
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

//reset token
exports.resetPassword = catchAsyncError(async(req, res, next) =>{

     //creating token hash
       const resetPasswordToken = crypto
       .createHash("sha256")
       .update(req.params.token)
       .digest("hex");

       console.log(req.params.token);
       console.log(resetPasswordToken);

        const user = await User.findOne({
          resetPasswordToken,
          resetPasswordExpire: { $gt : Date.now() },
         });

         if(!user){
          return next(new ErrorHandler("Reset password token has been invalid or expired", 400));
         }

         if(req.body.password != req.body.confirmPassword){
          return next(new ErrorHandler("Password does not match",400));
         }

         user.password = req.body.password;

         user.resetPasswordToken = undefined;
         user.resetPasswordExpire = undefined;

         await user.save({validateBeforeSave:false});
         sendToken(user, 200, res);
});

//get user details(admin's own profile details)
exports.getUserDetail = catchAsyncError(async(req, res, next) =>{
      const user = await User.findById(req.user.id);

      res.status(200).json({
        success:true,
        user,
      });
});

//update user password
exports.updatePassword = catchAsyncError(async(req, res, next) =>{
      const user = await User.findById(req.user.id).select("+password");

      const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

      if(!isPasswordMatched){
        return next(new ErrorHandler("old password is incorrect", 401)); 
      }

      if(req.body.newPassword != req.body.confirmPassword){
        return next(new ErrorHandler("Password do not match", 401)); 
      }

      user.password = req.body.newPassword;

      await user.save({validateBeforeSave:false});

      sendToken(user, 200, res);
});


//update user profile
exports.updateProfile = catchAsyncError(async(req, res, next) =>{
  
      const newUserData = {
        name: req.body.name,
        email : req.body.email,
      }

      const user = await User.findByIdAndUpdate(req.user.id, newUserData,{
        new:true,
        runValidators:true,
      });

    res.status(200).json({
      success:true
    });

});

//get all user
exports.getAllUser = catchAsyncError(async(req, res, next) => {
      const users = await User.find();

      res.status(200).json({
        success:true,
        users,
      });
});

//get all user(others detail check by ADMIN)
exports.getSingleUser = catchAsyncError(async(req, res, next) => {
      const user = await User.findById(req.params.id);

      if(!user){
        return next(new ErrorHandler(`User doesn't exist with id: ${req.params.id}`,401));
      }

      res.status(200).json({
        success:true,
        user,
      });
});

//update user role by admin
exports.updateUserRole = catchAsyncError(async(req, res, next) =>{
  
  const newUserData = {
    name: req.body.name,
    email : req.body.email,
    role : req.body.role,
  }

  const user = await User.findByIdAndUpdate(req.params.id, newUserData,{
    new:true,
    runValidators:true,
  });

  res.status(200).json({
    success:true
  });

});

//delete user profile by admin
exports.deleteProfile = catchAsyncError(async(req, res, next) =>{

  const user = await User.findById(req.params.id);

  if(!user){
    return next(new ErrorHandler(`User doesn't exist with id: ${req.params.id}`,401)) 
  }

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success:true
  });

});

