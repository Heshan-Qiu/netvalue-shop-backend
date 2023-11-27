// models/productModel.js
// Purpose: Product model for interacting with the database.

const pool = require("./db");
const logger = require("../logger");

// Retrieves a product by its ID
const getProductById = async (id) => {
    logger.info(`Fetching product with ID: ${id}`);
    const product = await pool.query(
        "SELECT * FROM netvalue_shop_products WHERE id = $1",
        [id]
    );
    return product.rows[0];
};

// Creates a new product
const createProduct = async (product) => {
    const { name, sku, price, description, imageUrl } = product;
    logger.info(`Creating product with name: ${name}`);
    const newProduct = await pool.query(
        "INSERT INTO netvalue_shop_products (name, sku, price, description, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [name, sku, price, description, imageUrl]
    );
    return newProduct.rows[0];
};

// Updates an existing product by ID
const updateProduct = async (id, product) => {
    const { name, sku, price, description, imageUrl } = product;
    logger.info(`Updating product with ID: ${id}`);
    const updatedProduct = await pool.query(
        "UPDATE netvalue_shop_products SET name = $1, sku = $2, price = $3, description = $4, image_url = $5 WHERE id = $6 RETURNING *",
        [name, sku, price, description, imageUrl, id]
    );
    return updatedProduct.rows[0];
};

// Deletes a product by its ID
const deleteProduct = async (id) => {
    logger.info(`Deleting product with ID: ${id}`);
    const deletedProduct = await pool.query(
        "DELETE FROM netvalue_shop_products WHERE id = $1 RETURNING *",
        [id]
    );
    return deletedProduct.rows[0];
};

// Retrieves the total number of products
const getTotalProductCount = async (search = null) => {
    let query;
    let queryParams;

    if (search) {
        logger.info(`Fetching total product count with search: ${search}`);
        query = `SELECT COUNT(*) FROM netvalue_shop_products WHERE name ILIKE $1 OR sku ILIKE $1 OR price::text ILIKE $1 OR description ILIKE $1`;
        queryParams = [`%${search}%`];
    } else {
        logger.info(`Fetching total product count`);
        query = "SELECT COUNT(*) FROM netvalue_shop_products";
        queryParams = [];
    }

    const totalProductCount = await pool.query(query, queryParams);
    return totalProductCount.rows[0];
};

// Retrieves a list of products with optional search, pagination, and filtering
const getProducts = async (search = null, page, limit) => {
    let query;
    let queryParams;

    if (search) {
        logger.info(`Fetching products list with search: ${search}`);
        query = `SELECT * FROM netvalue_shop_products WHERE name ILIKE $1 OR sku ILIKE $1 OR price::text ILIKE $1 OR description ILIKE $1`;
        queryParams = [`%${search}%`];
    } else {
        logger.info(`Fetching products list`);
        query = "SELECT * FROM netvalue_shop_products";
        queryParams = [];
    }

    if (page && limit) {
        if (search) {
            logger.info(
                `Fetching products list with search: ${search}, page: ${page}, limit: ${limit}`
            );
            query += " OFFSET $2 LIMIT $3";
        } else {
            logger.info(
                `Fetching products list with page: ${page}, limit: ${limit}`
            );
            query += " OFFSET $1 LIMIT $2";
        }
        queryParams.push((page - 1) * limit, limit);
    }

    const products = await pool.query(query, queryParams);
    return products.rows;
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getTotalProductCount,
};
