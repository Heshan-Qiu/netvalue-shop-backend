// models/cartModel.js
// This file defines the Cart model for database interactions, providing methods to create, read, update, and delete carts.

const pool = require("./db");
const logger = require("../logger");

/**
 * Fetches all carts along with associated user details.
 * @returns {Promise<Array>} A promise that resolves to an array of carts with user details.
 */
const getCartsWithUser = async () => {
    logger.info(`Fetching carts`);
    const carts = await pool.query(
        "SELECT c.cart_id, c.user_id, c.total_quantity, c.total_price, c.status, u.first_name AS user_first_name, u.last_name AS user_last_name, u.email AS user_email FROM netvalue_shop_carts c INNER JOIN netvalue_shop_users u ON c.user_id = u.user_id"
    );
    return carts.rows;
};

/**
 * Retrieves a specific cart by the user ID.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Object>} A promise that resolves to the cart of the specified user.
 */
const getCartByUserId = async (userId) => {
    logger.info(`Fetching cart with user ID: ${userId}`);
    const cart = await pool.query(
        "SELECT * FROM netvalue_shop_carts WHERE user_id = $1",
        [userId]
    );
    return cart.rows[0];
};

/**
 * Creates a new cart for a user.
 * @param {number} userId - The ID of the user.
 * @param {number} totalQuantiy - The total quantity of items in the cart.
 * @param {number} totalPrice - The total price of items in the cart.
 * @param {string} status - The status of the cart.
 * @returns {Promise<Object>} A promise that resolves to the created cart.
 */
const createCart = async (userId, totalQuantiy, totalPrice, status) => {
    logger.info(
        `Creating cart with user ID: ${userId}, total quantity: ${totalQuantiy}, total price: ${totalPrice}, status: ${status}`
    );
    const cart = await pool.query(
        "INSERT INTO netvalue_shop_carts (user_id, total_quantity, total_price, status) VALUES ($1, $2, $3, $4) RETURNING *",
        [userId, totalQuantiy, totalPrice, status]
    );
    return cart.rows[0];
};

/**
 * Updates an existing cart.
 * @param {string} cartId - The ID of the cart.
 * @param {number} totalQuantity - The updated total quantity.
 * @param {number} totalPrice - The updated total price.
 * @param {string} status - The updated status of the cart.
 * @returns {Promise<Object>} A promise that resolves to the updated cart.
 */
const updateCart = async (cartId, totalQuantity, totalPrice, status) => {
    logger.info(
        `Updating cart with cart ID: ${cartId}, total quantity: ${totalQuantity}, total price: ${totalPrice}, status: ${status}`
    );
    const cart = await pool.query(
        "UPDATE netvalue_shop_carts SET total_quantity = total_quantity + $1, total_price = total_price + $2, status = $3 WHERE cart_id = $4 RETURNING *",
        [totalQuantity, totalPrice, status, cartId]
    );
    return cart.rows[0];
};

module.exports = {
    getCartsWithUser,
    getCartByUserId,
    createCart,
    updateCart,
};
