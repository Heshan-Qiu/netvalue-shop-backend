const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Define a GET route to retrieve the total count of products.
// When a GET request is made to '/total', the getTotalProductCount function from the productController is called.
router.get("/total", productController.getTotalProductCount);

// Define a GET route to retrieve a specific product by its ID.
// When a GET request is made to '/:id', the getProductById function from the productController is invoked.
// ':id' is a route parameter used to capture the product ID from the URL.
router.get("/:id", productController.getProductById);

// Define a POST route to create a new product.
// When a POST request is made to '/', the createProduct function from the productController is invoked.
router.post("/", productController.createProduct);

// Define a PUT route to update an existing product by its ID.
// When a PUT request is made to '/:id', the updateProduct function from the productController is invoked.
router.put("/:id", productController.updateProduct);

// Define a DELETE route to delete a product by its ID.
// When a DELETE request is made to '/:id', the deleteProduct function from the productController is invoked.
router.delete("/:id", productController.deleteProduct);

// Define a GET route to retrieve a list of products, with optional search, pagination, and filtering.
// When a GET request is made to '/', the getProducts function from the productController is invoked.
router.get("/", productController.getProducts);

module.exports = router;
