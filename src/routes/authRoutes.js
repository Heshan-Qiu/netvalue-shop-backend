// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Define a POST route for user login.
// When a POST request is made to '/login', the loginUser function from the authController is called.
router.post("/login", authController.loginUser);

module.exports = router;
