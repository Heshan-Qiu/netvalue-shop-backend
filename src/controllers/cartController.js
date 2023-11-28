const logger = require("../logger");
const cartModel = require("../models/cartModel");
const cartItemModel = require("../models/cartItemModel");
const userModel = require("../models/userModel");

// Get carts
const getCarts = async (req, res) => {
    try {
        logger.info(`Fetching carts`);
        const carts = await cartModel.getCartsWithUser();
        res.json(carts);
    } catch (err) {
        logger.error(`Error fetching carts: ${err.message}`);
        res.status(500).json({ message: "Server Error" });
    }
};

// Get cart and cart items by user email
const getCartByUserEmail = async (req, res) => {
    try {
        const { userEmail } = req.params;

        const user = await userModel.getUserByEmail(userEmail);
        if (!user) {
            logger.info(`User with email: ${userEmail} not found`);
            return res.status(400).json({ message: "Invalid user" });
        }

        const userId = user.user_id;
        logger.info(`Fetching cart for user ID: ${userId}`);
        const cart = await cartModel.getCartByUserId(userId);
        if (!cart) {
            logger.info(`No cart found for user ID: ${userId}`);
            return res.json({});
        }

        logger.info(`Fetching cart items for cart ID: ${cart.cart_id}`);
        const cartItems =
            await cartItemModel.getCartItemsWithProductNameAndImage(
                cart.cart_id
            );

        res.json({ cart, cartItems });
    } catch (err) {
        logger.error(`Error fetching cart: ${err.message}`);
        res.status(500).json({ message: "Server Error" });
    }
};

// Add a product to the cart
const addProductToCart = async (req, res) => {
    try {
        const { userEmail, productId, quantity, price } = req.body;

        const user = await userModel.getUserByEmail(userEmail);
        if (!user) {
            logger.info(`User with email: ${userEmail} not found`);
            return res.status(400).json({ message: "Invalid user" });
        }

        const userId = user.user_id;
        logger.info(`Adding product with ID: ${productId} to cart`);
        const cart = await cartModel.getCartByUserId(userId);
        if (!cart) {
            logger.info(
                `No cart found for user ID: ${userId}, creating a new one`
            );
            const newCart = await cartModel.createCart(
                userId,
                quantity,
                price,
                "OPEN"
            );
            await cartItemModel.createCartItem(
                newCart.cart_id,
                productId,
                quantity,
                price
            );
            return res.json(newCart);
        }

        logger.info(`Cart found with ID: ${cart.cart_id}`);
        const cartItem = await cartItemModel.getCartItem(
            cart.cart_id,
            productId
        );
        if (!cartItem) {
            logger.info(
                `Product with ID: ${productId} not found in cart, adding it`
            );
            await cartItemModel.createCartItem(
                cart.cart_id,
                productId,
                quantity,
                price
            );
        } else {
            logger.info(
                `Product with ID: ${productId} already in cart, updating quantity and price`
            );
            await cartItemModel.updateCartItem(
                cartItem.cart_item_id,
                quantity,
                price
            );
        }

        // Update cart total quantity and price
        logger.info(`Updating cart total quantity and price`);
        const updatedCart = await cartModel.updateCart(
            cart.cart_id,
            quantity,
            price,
            "UPDATED"
        );

        res.json(updatedCart);
    } catch (err) {
        logger.error(`Error adding product to cart: ${err.message}`);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = {
    getCarts,
    getCartByUserEmail,
    addProductToCart,
};
