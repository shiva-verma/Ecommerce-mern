const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true, "Please enter your name"],
        maxLength:[30, "Name cannot exceed 10 character"],
        minLength:[4, "Name should have more than 4 character"]
    },
    email:{
        type:String,
        required:[true,"Please enter your email"],
        unique:true,
        validate:[validator.isEmail, "Please enter valid email"],

    },
    password:{
        type:String,
        required:[true,"Please enter your password"],
        minLength:[8, "Name should have more than 8 character"],
        select: false
    },
    avatar:{
        public_id:{
        type:String,
        required:true
        },
        url:{
            type:String,
            required:true 
        }
    },
    role:{
        type:String,
        default:"user"
    },

    resetPasswordToken:String,
    resetPasswordExpire:Date,
});

// password hashing before saving in database
userSchema.pre('save', async function(next){

    if(!this.isModified("password")){
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
});

//JWT token
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id}, process.env.JWT_SECRET,{
       expiresIn: process.env.JWT_EXPIRE, 
    })
};

//compare password
userSchema.methods.comparePassword = async function(enteredPassword){
        return await bcrypt.compare(enteredPassword, this.password);
        
};

// reset user
//generating password reset token
userSchema.methods.getPasswordResetToken = async function(){
    //generating token
    const resetToken = crypto.randomBytes(20).toString("hex");

    //hasing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    //create token expire time
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
}


module.exports = mongoose.model("User", userSchema);