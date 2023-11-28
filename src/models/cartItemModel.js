// models/cartItemModel.js
// This file defines the Cart Item model for database interactions, providing methods to create, read, update, and delete cart items.

const pool = require("./db");
const logger = require("../logger");

/**
 * Retrieves a specific cart item based on cart and product IDs.
 * @param {string} cartId - The ID of the cart.
 * @param {string} productId - The ID of the product.
 * @returns {Promise<Object>} A promise that resolves to the specified cart item.
 */
const getCartItem = async (cartId, productId) => {
    logger.info(
        `Fetching cart item with cart ID: ${cartId}, product ID: ${productId}`
    );
    const cartItem = await pool.query(
        "SELECT * FROM netvalue_shop_cart_items WHERE cart_id = $1 AND product_id = $2",
        [cartId, productId]
    );
    return cartItem.rows[0];
};

/**
 * Retrieves all cart items for a specific cart, including product names and images.
 * @param {string} cartId - The ID of the cart.
 * @returns {Promise<Array>} A promise that resolves to an array of cart items with product details.
 */
const getCartItemsWithProductNameAndImage = async (cartId) => {
    logger.info(`Fetching cart items with cart ID: ${cartId}`);
    const cartItems = await pool.query(
        "SELECT c.cart_item_id, c.cart_id, c.product_id, c.quantity, c.price, p.name AS product_name, p.image_url AS product_image_url FROM netvalue_shop_cart_items c INNER JOIN netvalue_shop_products p ON c.product_id = p.id WHERE cart_id = $1",
        [cartId]
    );
    return cartItems.rows;
};

/**
 * Creates a new cart item.
 * @param {string} cartId - The ID of the cart.
 * @param {string} productId - The ID of the product.
 * @param {number} quantity - The quantity of the product.
 * @param {number} price - The price of the product.
 * @returns {Promise<Object>} A promise that resolves to the created cart item.
 */
const createCartItem = async (cartId, productId, quantity, price) => {
    logger.info(
        `Creating cart item with cart ID: ${cartId}, product ID: ${productId}, quantity: ${quantity}, price: ${price}`
    );
    const cartItem = await pool.query(
        "INSERT INTO netvalue_shop_cart_items (cart_id, product_id, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *",
        [cartId, productId, quantity, price]
    );
    return cartItem.rows[0];
};

/**
 * Updates an existing cart item.
 * @param {string} cartItemId - The ID of the cart item.
 * @param {number} quantity - The new quantity.
 * @param {number} price - The new price.
 * @returns {Promise<Object>} A promise that resolves to the updated cart item.
 */
const updateCartItem = async (cartItemId, quantity, price) => {
    logger.info(
        `Updating cart item with cart item ID: ${cartItemId}, quantity: ${quantity}, price: ${price}`
    );
    const cartItem = await pool.query(
        "UPDATE netvalue_shop_cart_items SET quantity = quantity + $1, price = price + $2 WHERE cart_item_id = $3 RETURNING *",
        [quantity, price, cartItemId]
    );
    return cartItem.rows[0];
};

module.exports = {
    getCartItem,
    getCartItemsWithProductNameAndImage,
    createCartItem,
    updateCartItem,
};
