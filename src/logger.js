const winston = require("winston");
const path = require("path");

const logsDir = path.join(__dirname, "../logs"); // Set the directory for storing log files.

// Create a Winston logger configuration.
const logger = winston.createLogger({
    level: "info", // Set the base logging level to 'info'.
    format: winston.format.combine(
        winston.format.timestamp({
            // Include timestamps in logs.
            format: "YYYY-MM-DD HH:mm:ss", // Set the format of the timestamp.
        }),
        winston.format.errors({ stack: true }), // Include stack trace in error logs.
        winston.format.splat(), // Enable string interpolation.
        winston.format.json() // Log in JSON format.
    ),
    defaultMeta: { service: "NetValue-Shop" }, // Set default metadata for logs.

    // Define transports for writing logs.
    transports: [
        // Write all logs to a file named 'combined.log' in the logs directory.
        new winston.transports.File({
            filename: path.join(logsDir, "combined.log"),
        }),

        // Write all logs with level 'error' and below to 'errors.log'.
        new winston.transports.File({
            filename: path.join(logsDir, "errors.log"),
            level: "error",
        }),

        // Write all logs to the console if not in production environment.
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(), // Colorize log output for console.
                winston.format.simple() // Simple formatting for console output.
            ),
        }),
    ],
});

module.exports = logger; // Export the configured logger.
