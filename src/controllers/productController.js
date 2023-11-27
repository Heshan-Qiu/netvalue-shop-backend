const logger = require("../logger");
const productModel = require("../models/productModel");

// Retrieves a product by its ID
const getProductById = async (req, res) => {
    try {
        const id = req.params.id;
        logger.info(`Fetching product with ID: ${id}`);
        const product = await productModel.getProductById(id);
        if (!product) {
            logger.warn(`Product with ID: ${id} not found`);
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    } catch (err) {
        logger.error(`Error fetching product: ${err.message}`);
        res.status(500).json({ message: "Server Error" });
    }
};

// Creates a new product
const createProduct = async (req, res) => {
    try {
        const product = req.body;
        logger.info(`Creating a new product`);
        const newProduct = await productModel.createProduct(product);
        res.json(newProduct);
    } catch (err) {
        logger.error(`Error creating product: ${err.message}`);
        res.status(500).json({ message: "Server Error" });
    }
};

// Updates an existing product by ID
const updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const product = req.body;
        logger.info(`Updating product with ID: ${id}`);
        const updatedProduct = await productModel.updateProduct(id, product);
        res.json(updatedProduct);
    } catch (err) {
        logger.error(`Error updating product: ${err.message}`);
        res.status(500).json({ message: "Server Error" });
    }
};

// Deletes a product by its ID
const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        logger.info(`Deleting product with ID: ${id}`);
        const deletedProduct = await productModel.deleteProduct(id);
        res.json(deletedProduct);
    } catch (err) {
        logger.error(`Error deleting product: ${err.message}`);
        res.status(500).json({ message: "Server Error" });
    }
};

// Retrieves a list of products with optional search, pagination, and filtering
const getProducts = async (req, res) => {
    try {
        const search = req.query.search || null;
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        logger.info(
            `Fetching products list with search: ${search}, page: ${page}, limit: ${limit}`
        );

        const total = await productModel.getTotalProductCount(search);
        if (total.count === "0") {
            logger.info(`No products found for search: ${search}`);
            return res.json({
                page,
                totalPages: 0,
                limit,
                total: 0,
                data: [],
            });
        }

        const products = await productModel.getProducts(search, page, limit);

        res.json({
            page,
            totalPages: Math.ceil(total.count / limit),
            limit,
            total: total.count,
            data: products,
        });
    } catch (err) {
        logger.error(`Error fetching products list: ${err.message}`);
        res.status(500).json({ message: "Server Error" });
    }
};

// Retrieves the total number of products
const getTotalProductCount = async (req, res) => {
    try {
        const search = req.query.search || null;
        logger.info(`Fetching total product count with search: ${search}`);
        const total = await productModel.getTotalProductCount(search);
        res.json(total);
    } catch (err) {
        logger.error(`Error fetching total product count: ${err.message}`);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getTotalProductCount,
};
