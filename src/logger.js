const winston = require("winston");
const path = require("path");

const logsDir = path.join(__dirname, "../logs");

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss",
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),
    defaultMeta: { service: "NetValue-Shop" },
    transports: [
        // - Write all logs to `combined.log`
        new winston.transports.File({
            filename: path.join(logsDir, "combined.log"),
        }),
        // - Write all logs with level `error` and below to `errors.log`
        new winston.transports.File({
            filename: path.join(logsDir, "errors.log"),
            level: "error",
        }),
        // - Write all logs to the console if not in production
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        }),
    ],
});

module.exports = logger;
