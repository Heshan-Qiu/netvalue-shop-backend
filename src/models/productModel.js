const pool = require("./db");

const getProductById = async (id) => {
    const product = await pool.query(
        "SELECT * FROM netvalue_shop_products WHERE id = $1",
        [id]
    );
    return product.rows[0];
};

const createProduct = async (product) => {
    const { name, sku, price, description, imageUrl } = product;
    const newProduct = await pool.query(
        "INSERT INTO netvalue_shop_products (name, sku, price, description, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [name, sku, price, description, imageUrl]
    );
    return newProduct.rows[0];
};

const updateProduct = async (id, product) => {
    const { name, sku, price, description, imageUrl } = product;
    const updatedProduct = await pool.query(
        "UPDATE netvalue_shop_products SET name = $1, sku = $2, price = $3, description = $4, image_url = $5 WHERE id = $6 RETURNING *",
        [name, sku, price, description, imageUrl, id]
    );
    return updatedProduct.rows[0];
};

const deleteProduct = async (id) => {
    const deletedProduct = await pool.query(
        "DELETE FROM netvalue_shop_products WHERE id = $1 RETURNING *",
        [id]
    );
    return deletedProduct.rows[0];
};

const getTotalProductCount = async (search = null) => {
    let query;
    let queryParams;

    if (search) {
        query = `SELECT COUNT(*) FROM netvalue_shop_products WHERE name ILIKE $1 OR sku ILIKE $1 OR price::text ILIKE $1 OR description ILIKE $1`;
        queryParams = [`%${search}%`];
    } else {
        query = "SELECT COUNT(*) FROM netvalue_shop_products";
        queryParams = [];
    }

    const totalProductCount = await pool.query(query, queryParams);
    return totalProductCount.rows[0];
};

const getProducts = async (search = null, page, limit) => {
    let query;
    let queryParams;

    if (search) {
        query = `SELECT * FROM netvalue_shop_products WHERE name ILIKE $1 OR sku ILIKE $1 OR price::text ILIKE $1 OR description ILIKE $1`;
        queryParams = [`%${search}%`];
    } else {
        query = "SELECT * FROM netvalue_shop_products";
        queryParams = [];
    }

    if (page && limit) {
        if (search) {
            query += " OFFSET $2 LIMIT $3";
        } else {
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
