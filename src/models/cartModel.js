const pool = require("./db");
const logger = require("../logger");

const getCartsWithUser = async () => {
    logger.info(`Fetching carts`);
    const carts = await pool.query(
        "SELECT c.cart_id, c.user_id, c.total_quantity, c.total_price, c.status, u.first_name AS user_first_name, u.last_name AS user_last_name, u.email AS user_email FROM netvalue_shop_carts c INNER JOIN netvalue_shop_users u ON c.user_id = u.user_id"
    );
    return carts.rows;
};

const getCartByUserId = async (userId) => {
    logger.info(`Fetching cart with user ID: ${userId}`);
    const cart = await pool.query(
        "SELECT * FROM netvalue_shop_carts WHERE user_id = $1",
        [userId]
    );
    return cart.rows[0];
};

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
