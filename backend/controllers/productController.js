const { findById } = require("../models/productModel");
const product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeature = require("../utils/apiFeature");

//create product -- admin route
exports.createProduct = catchAsyncError(async(req, res, next) => {

      req.body.user = req.user.id;
      const newProduct = await product.create(req.body);
      res.status(200).json({
        success:true,
        newProduct
      });
});


//get all products
// const productCount = product.countDocuments();
exports.getAllProducts = catchAsyncError(async(req, res) => {

    const resultPerPage = 3;
    

    const apiFeature = new ApiFeature(product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

    const products = await apiFeature.query;
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
        singleProduct,
     });
});

//create review and update review
exports.createProductReview = catchAsyncError(async(req, res, next) => {

   const {rating, comment, productId} = req.body;
    const review = {
      user: req.user._id,
      name:req.user.name,
      rating:Number(rating),
      comment,
    };

    const Product = await product.findById(productId);

    const isReviewed = Product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
   );

    if(isReviewed){
      Product.reviews.forEach((rev)=>{
         if(rev.user.toString() === req.user._id.toString()){
            rev.rating= rating,
            rev.comment= comment
         }
      });
    }else{
       Product.reviews.push(review)
       Product.numOfReviews = Product.reviews.length;
    };

    let avg = 0;
    Product.reviews.forEach((rev)=>{
         avg += rev.rating;
    });
    
    Product.ratings = avg/Product.reviews.length;

    await Product.save({validateBeforeSave:false});

    res.status(200).json({
      success:true,
    });
});

//get all reviews of single product
exports.getAllReviews = catchAsyncError(async(req, res, next) =>{
      const Product = await product.findById(req.query.id);
   
      if(!Product){
         return next(new ErrorHandler("Product doesn't exist", 400));
      }

      res.status(200).json({
         success:true,
         reviews:Product.reviews,
      });
});

//delete reviews
exports.deleteReviews = catchAsyncError(async(req, res, next) =>{
   const Product = await product.findById(req.query.productId);
   
   if(!Product){
      return next(new ErrorHandler("Product doesn't exist", 400));
   }

   const reviews = Product.reviews.filter((rev) => rev._id.toString() !== req.query.id.toString());

   let avg = 0;
    reviews.forEach((rev)=>{
         avg += rev.rating;
    });
    
    const ratings = avg / reviews.length;

    const numOfReviews = reviews.length;

    await product.findByIdAndUpdate(req.query.productId, {
      reviews,
      rating,
      numOfReviews,
    },{
      new:true,
      runValidators:true,
      useFindAndModify:false,
    });

      res.status(200).json({
         success:true,
      }); 
});