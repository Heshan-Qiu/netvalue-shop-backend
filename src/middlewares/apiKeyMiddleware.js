require("dotenv").config();
const logger = require("../logger");

function apiKeyMiddleware(req, res, next) {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
        logger.warn("API key is missing");
        return res.status(401).json({ error: "API key is missing" });
    }

    const validApiKey = process.env.API_KEY;

    if (apiKey !== validApiKey) {
        logger.warn(`Invalid API key: ${apiKey}`);
        return res.status(403).json({ error: "Invalid API key" });
    }

    logger.info("API key is valid");
    next();
}

module.exports = apiKeyMiddleware;
