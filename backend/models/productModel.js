const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        require: [true, "Please Enter Product Name"],
        trim: true
    },
    description:{
        type: String,
        require: [true, "Please Enter Product Description"] 
    },
    price:{
        type: Number,
        required:[true,"Please Enter Product Price"],
        maxLength:[0,"Price cannot exceed 8 chracter"]
    },
    rating:{
        type:Number,
        default:0
    },
    images:[
        {
            public_id:{
            type:String,
            required:true
            },
            url:{
                type:String,
                required:true 
            }
        }
    ],
    category:{
        type: String,
        required:[true, "Please Enter product categeory"]
    },
    stock:{
        type:Number,
        required:[true, "Please Enter Product Stock"],
        maxLength:[4,"Stocks cannot exceed 4 chracter"],
        default:1
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            }
       }
    ],
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

module.exports = mongoose.model("Product", productSchema);

