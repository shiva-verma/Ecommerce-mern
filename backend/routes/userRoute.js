const express = require('express');
const { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserDetail, updatePassword, updateProfile, getAllUser, getSingleUser, updateUserRole, deleteProfile } = require('../controllers/userController');
const { isAuthenticated, authorizeRole } = require('../middleware/auth');
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword)
router.route("/logout").get(logoutUser);
router.route("/me").get(isAuthenticated, getUserDetail);
router.route("/password/update").put(isAuthenticated, updatePassword);
router.route("/me/update").put(isAuthenticated, updateProfile);
router.route("/admin/users").get(isAuthenticated, authorizeRole("admin"), getAllUser);
router.route("/admin/user/:id").get(isAuthenticated, authorizeRole("admin"), getSingleUser);
router.route("/admin/user/:id").put(isAuthenticated, authorizeRole("admin"), updateUserRole);
router.route("/admin/user/:id").delete(isAuthenticated, authorizeRole("admin"), deleteProfile);

module.exports = router;