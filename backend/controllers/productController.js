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