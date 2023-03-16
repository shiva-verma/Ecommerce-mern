const express = require('express');
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetail } = require('../controllers/productController');

const router = express.Router();

//GET ALL PRODUCTS
router.route("/products").get(getAllProducts),

//CREATE A NEW PRODUCT
router.route("/product/new").post(createProduct);

//UPDATE A PRODUCT
router.route("/product/:id").put(updateProduct);

//DELETE A PRODUCT
router.route("/product/:id").delete(deleteProduct);

//GET A SINGLE PRODUCT
router.route("/product/:id").get(getProductDetail);

module.exports = router;