const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Define a GET route to retrieve a user by their email.
// When a GET request is made to '/:email', the getUserByEmail function from the userController is called.
// ':email' is a route parameter that will capture the user's email from the URL.
router.get("/:email", userController.getUserByEmail);

module.exports = router;
