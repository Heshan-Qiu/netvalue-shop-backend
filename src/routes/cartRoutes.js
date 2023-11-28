const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

// Define a GET route to retrieve all carts.
// When a GET request is made to the root path ('/'), the getCarts function from the cartController is invoked.
router.get("/", cartController.getCarts);

// Define a POST route to add a product to a cart.
// When a POST request is made to the root path ('/'), the addProductToCart function from the cartController is invoked.
router.post("/", cartController.addProductToCart);

// Define a GET route to retrieve a cart by the user's email.
// When a GET request is made to '/:userEmail', the getCartByUserEmail function from the cartController is invoked.
// ':userEmail' is a route parameter that will be used to capture the user's email from the URL.
router.get("/:userEmail", cartController.getCartByUserEmail);

module.exports = router;
