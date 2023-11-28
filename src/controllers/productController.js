const logger = require("../logger");
const productModel = require("../models/productModel");

/**
 * Retrieves a product by its ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const getProductById = async (req, res) => {
    try {
        const id = req.params.id; // Extract the product ID from the request parameters.
        logger.info(`Fetching product with ID: ${id}`);
        const product = await productModel.getProductById(id); // Fetch the product using the model.

        if (!product) {
            logger.warn(`Product with ID: ${id} not found`);
            return res.status(404).json({ message: "Product not found" }); // Respond with 404 if the product is not found.
        }

        res.json(product); // Send the found product as a response.
    } catch (err) {
        logger.error(`Error fetching product: ${err.message}`);
        res.status(500).json({ message: "Server Error" }); // Handle server errors.
    }
};

/**
 * Creates a new product.
 * @param {Object} req - The request object containing product data.
 * @param {Object} res - The response object.
 */
const createProduct = async (req, res) => {
    try {
        const product = req.body; // Extract product data from the request body.
        logger.info(`Creating a new product`);
        const newProduct = await productModel.createProduct(product); // Create a new product using the model.

        res.json(newProduct); // Send the newly created product as a response.
    } catch (err) {
        logger.error(`Error creating product: ${err.message}`);
        res.status(500).json({ message: "Server Error" }); // Handle server errors.
    }
};

/**
 * Updates an existing product by ID.
 * @param {Object} req - The request object containing updated product data.
 * @param {Object} res - The response object.
 */
const updateProduct = async (req, res) => {
    try {
        const id = req.params.id; // Extract the product ID from the request parameters.
        const product = req.body; // Extract product data from the request body.
        logger.info(`Updating product with ID: ${id}`);
        const updatedProduct = await productModel.updateProduct(id, product); // Update the product using the model.

        res.json(updatedProduct); // Send the updated product as a response.
    } catch (err) {
        logger.error(`Error updating product: ${err.message}`);
        res.status(500).json({ message: "Server Error" }); // Handle server errors.
    }
};

/**
 * Deletes a product by its ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id; // Extract the product ID from the request parameters.
        logger.info(`Deleting product with ID: ${id}`);
        const deletedProduct = await productModel.deleteProduct(id); // Delete the product using the model.

        res.json(deletedProduct); // Send the deleted product as a response.
    } catch (err) {
        logger.error(`Error deleting product: ${err.message}`);
        res.status(500).json({ message: "Server Error" }); // Handle server errors.
    }
};

/**
 * Retrieves a list of products with optional search, pagination, and filtering.
 * @param {Object} req - The request object containing search parameters.
 * @param {Object} res - The response object.
 */
const getProducts = async (req, res) => {
    try {
        const search = req.query.search || null; // Extract the search query parameter.
        const page = parseInt(req.query.page) || 1; // Extract the page number parameter.
        const limit = parseInt(req.query.limit) || 10; // Extract the limit parameter.
        logger.info(
            `Fetching products list with search: ${search}, page: ${page}, limit: ${limit}`
        );

        const total = await productModel.getTotalProductCount(search); // Get the total product count with optional search.
        if (total.count === "0") {
            logger.info(`No products found for search: ${search}`);
            return res.json({ page, totalPages: 0, limit, total: 0, data: [] }); // Respond with empty data if no products are found.
        }

        const products = await productModel.getProducts(search, page, limit); // Fetch the products list using the model.

        res.json({
            page,
            totalPages: Math.ceil(total.count / limit),
            limit,
            total: total.count,
            data: products,
        }); // Send the products list as a response.
    } catch (err) {
        logger.error(`Error fetching products list: ${err.message}`);
        res.status(500).json({ message: "Server Error" }); // Handle server errors.
    }
};

/**
 * Retrieves the total number of products.
 * @param {Object} req - The request object containing search parameters.
 * @param {Object} res - The response object.
 */
const getTotalProductCount = async (req, res) => {
    try {
        const search = req.query.search || null; // Extract the search query parameter.
        logger.info(`Fetching total product count with search: ${search}`);
        const total = await productModel.getTotalProductCount(search); // Get the total product count with optional search.

        res.json(total); // Send the total product count as a response.
    } catch (err) {
        logger.error(`Error fetching total product count: ${err.message}`);
        res.status(500).json({ message: "Server Error" }); // Handle server errors.
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
