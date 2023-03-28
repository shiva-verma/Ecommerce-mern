const express = require('express');
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetail, createProductReview, getAllReviews, deleteReviews } = require('../controllers/productController');
const { isAuthenticated, authorizeRole} = require('../middleware/auth');

const router = express.Router();

//GET ALL PRODUCTS
router.route("/products").get(getAllProducts);

//CREATE A NEW PRODUCT
router.route("/admin/product/new").post(isAuthenticated, authorizeRole("admin"), createProduct);

//UPDATE A PRODUCT
router.route("/admin/product/:id").put(isAuthenticated, authorizeRole("admin"), updateProduct);

//DELETE A PRODUCT
router.route("/admin/product/:id").delete(isAuthenticated, authorizeRole("admin"), deleteProduct);

//GET A SINGLE PRODUCT
router.route("/product/:id").get(getProductDetail);

//create or update a review
router.route("/review").put(isAuthenticated ,createProductReview);

//get all reviews of particular product
router.route("/reviews").get(getAllReviews);

//delete a reviews of particular product
router.route("/reviews").delete(isAuthenticated, deleteReviews);


module.exports = router;