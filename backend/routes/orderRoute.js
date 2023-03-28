const express = require("express");
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require("../controllers/orderController");
const router = express.Router();
const { isAuthenticated, authorizeRole} = require('../middleware/auth');

router.route("/order/new").post(isAuthenticated, newOrder);
router.route("/order/:id").get(isAuthenticated, getSingleOrder);
router.route("/orders/me").get(isAuthenticated, myOrders);
router.route("/admin/orders").get(isAuthenticated, authorizeRole("admin"), getAllOrders);
router.route("/admin/order/:id").put(isAuthenticated, authorizeRole("admin"), updateOrder);
router.route("/admin/order/:id").delete(isAuthenticated, authorizeRole("admin"), deleteOrder);


module.exports = router;