const { findById } = require("../models/productModel");
const product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");

//create product -- admin route
exports.createProduct = catchAsyncError(async(req, res, next) => {
      const newProduct = await product.create(req.body);
      res.status(200).json({
        success:true,
        newProduct
      });
});


//get all products
exports.getAllProducts = catchAsyncError(async(req, res) => {
    const products = await product.find();
    res.status(200).json({
        success:true,
        products
      });
});

//update product --admin route
exports.updateProduct = catchAsyncError(async(req, res, next) => {
     let updatedProduct = await product.findById(req.params.id);

     if(!updatedProduct){
      return next(new ErrorHandler("product not found",404))
   }

     updatedProduct = await product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators:true,
        useFindAndModify: false
     });

     res.status(200).json({
        success:true,
        updatedProduct
     });
});

//DELETE PRODUCT --ADMIN ROUTE
exports.deleteProduct = catchAsyncError(async(req, res) => {
    const deletedProduct = await product.findById(req.params.id);

    if(!deletedProduct){
      return next(new ErrorHandler("product not found",404))
   }

     await product.findByIdAndDelete(req.params.id);

     res.status(200).json({
        success:true,
        message:"Product deleted successfully"
     });
});

//GET single product details
exports.getProductDetail = catchAsyncError(async(req, res, next) => {
    const singleProduct = await product.findById(req.params.id);

    if(!singleProduct){
        return next(new ErrorHandler("product not found",404))
     }
     
     res.status(200).json({
        success:true,
        singleProduct
     });
});