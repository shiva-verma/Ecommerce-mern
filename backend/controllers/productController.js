const { findById } = require("../models/productModel");
const product = require("../models/productModel");

//create product -- admin route
exports.createProduct = async(req, res, next) => {
      const newProduct = await product.create(req.body);
      res.status(200).json({
        success:true,
        newProduct
      })
}


//get all products
exports.getAllProducts = async(req, res) => {
    const products = await product.find();
    res.status(200).json({
        success:true,
        products
      })
}

//update product --admin route
exports.updateProduct = async(req, res, next) => {
     let updatedProduct = await product.findById(req.params.id);

     if(!updatedProduct){
        return res.status(500).json({
            success:false,
            message:"Product Not Found"
        })
     }

     updatedProduct = await product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators:true,
        useFindAndModify: false
     });

     res.status(200).json({
        success:true,
        updatedProduct
     })
}

//DELETE PRODUCT --ADMIN ROUTE
exports.deleteProduct = async(req, res) => {
    const deletedProduct = await product.findById(req.params.id);

    if(!deletedProduct){
        return res.status(500).json({
            success:false,
            message:"Product Not Found"
        })
     }

     await product.findByIdAndDelete(req.params.id);

     res.status(200).json({
        success:true,
        message:"Product deleted successfully"
     })
}

//GET single product details
exports.getProductDetail = async(req, res, next) => {
    const singleProduct = await product.findById(req.params.id);

    if(!singleProduct){
        return res.status(500).json({
            success:false,
            message:"Product Not Found"
        })
     }
     
     res.status(200).json({
        success:true,
        singleProduct
     })
}