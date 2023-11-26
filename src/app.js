const express = require("express");
const morgan = require("morgan");
const logger = require("./logger");
const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(express.json());

app.use(
    morgan("combined", { stream: { write: (message) => logger.info(message) } })
);

app.use("/products", productRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
