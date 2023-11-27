const express = require("express");
const morgan = require("morgan");
const logger = require("./logger");

const apiKeyMiddleware = require("./middlewares/apiKeyMiddleware");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();
app.use(express.json());

app.use(
    morgan("combined", { stream: { write: (message) => logger.info(message) } })
);

app.use(apiKeyMiddleware);

app.use("/auth", authRoutes);
app.use("/products", productRoutes);

app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
