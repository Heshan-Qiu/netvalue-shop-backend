const express = require("express");
const morgan = require("morgan");
const logger = require("./logger");

const apiKeyMiddleware = require("./middlewares/apiKeyMiddleware");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");

const app = express();
app.use(express.json());

// Setup Morgan to log HTTP requests, integrating with the custom logger.
app.use(
    morgan("combined", { stream: { write: (message) => logger.info(message) } })
);

app.use(apiKeyMiddleware); // Use the API key middleware for validating requests.

// Setup routes for different parts of the application.
app.use("/auth", authRoutes); // Routes for authentication.
app.use("/users", userRoutes); // Routes for user-related operations.
app.use("/products", productRoutes); // Routes for product-related operations.
app.use("/carts", cartRoutes); // Routes for cart-related operations.

// Global error handler middleware.
app.use((err, req, res, next) => {
    logger.error(err.stack); // Log the error stack.
    res.status(500).json({ message: "Internal Server Error" }); // Send a generic server error response.
});

// Define the port to listen on.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`); // Start the server and log the port.
});
