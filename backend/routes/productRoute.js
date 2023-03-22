const express = require('express');
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetail } = require('../controllers/productController');
const { isAuthenticated, authorizeRole} = require('../middleware/auth');

const router = express.Router();

//GET ALL PRODUCTS
router.route("/products").get(getAllProducts);

//CREATE A NEW PRODUCT
router.route("/product/new").post(isAuthenticated, authorizeRole("user"), createProduct);

//UPDATE A PRODUCT
router.route("/product/:id").put(isAuthenticated, authorizeRole("admin"), updateProduct);

//DELETE A PRODUCT
router.route("/product/:id").delete(isAuthenticated, authorizeRole("admin"), deleteProduct);

//GET A SINGLE PRODUCT
router.route("/product/:id").get(getProductDetail);

module.exports = router;