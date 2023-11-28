require("dotenv").config(); // Load environment variables from a .env file into process.env
const logger = require("../logger"); // Import the logger for logging information.

/**
 * Middleware to validate the API key present in the request headers.
 * @param {Object} req - The request object from Express.js.
 * @param {Object} res - The response object from Express.js.
 * @param {Function} next - The next middleware function in the Express.js route.
 */
function apiKeyMiddleware(req, res, next) {
    const apiKey = req.headers["x-api-key"]; // Retrieve the API key from the request headers.

    // Check if the API key is provided in the request.
    if (!apiKey) {
        logger.warn("API key is missing"); // Log a warning for missing API key.
        return res.status(401).json({ error: "API key is missing" }); // Return a 401 Unauthorized response if API key is missing.
    }

    const validApiKey = process.env.API_KEY; // Retrieve the valid API key from environment variables.

    // Check if the provided API key matches the valid API key.
    if (apiKey !== validApiKey) {
        logger.warn(`Invalid API key: ${apiKey}`); // Log a warning for invalid API key.
        return res.status(403).json({ error: "Invalid API key" }); // Return a 403 Forbidden response if API key is invalid.
    }

    logger.info("API key is valid"); // Log information on valid API key.
    next(); // Call the next middleware function if the API key is valid.
}

module.exports = apiKeyMiddleware; // Export the apiKeyMiddleware for use in Express.js routes.
