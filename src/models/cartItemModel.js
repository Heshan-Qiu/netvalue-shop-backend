const pool = require("./db");
const logger = require("../logger");

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

const getCartItemsWithProductNameAndImage = async (cartId) => {
    logger.info(`Fetching cart items with cart ID: ${cartId}`);
    const cartItems = await pool.query(
        "SELECT c.cart_item_id, c.cart_id, c.product_id, c.quantity, c.price, p.name AS product_name, p.image_url AS product_image_url FROM netvalue_shop_cart_items c INNER JOIN netvalue_shop_products p ON c.product_id = p.id WHERE cart_id = $1",
        [cartId]
    );
    return cartItems.rows;
};

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
