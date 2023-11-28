const logger = require("../logger");
const cartModel = require("../models/cartModel");
const cartItemModel = require("../models/cartItemModel");
const userModel = require("../models/userModel");

/**
 * Retrieves all carts including user details.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const getCarts = async (req, res) => {
    try {
        logger.info(`Fetching carts`);
        const carts = await cartModel.getCartsWithUser(); // Fetch all carts with associated user details.
        res.json(carts); // Send the carts as a response.
    } catch (err) {
        logger.error(`Error fetching carts: ${err.message}`);
        res.status(500).json({ message: "Server Error" }); // Handle server errors.
    }
};

/**
 * Retrieves a cart and its items for a user identified by their email.
 * @param {Object} req - The request object containing user email.
 * @param {Object} res - The response object.
 */
const getCartByUserEmail = async (req, res) => {
    try {
        const { userEmail } = req.params;

        // Fetch user details by email.
        const user = await userModel.getUserByEmail(userEmail);
        if (!user) {
            logger.info(`User with email: ${userEmail} not found`);
            return res.status(400).json({ message: "Invalid user" });
        }

        // Fetch the cart for the user.
        const userId = user.user_id;
        logger.info(`Fetching cart for user ID: ${userId}`);
        const cart = await cartModel.getCartByUserId(userId);
        if (!cart) {
            logger.info(`No cart found for user ID: ${userId}`);
            return res.json({});
        }

        // Fetch cart items for the cart.
        logger.info(`Fetching cart items for cart ID: ${cart.cart_id}`);
        const cartItems =
            await cartItemModel.getCartItemsWithProductNameAndImage(
                cart.cart_id
            );

        res.json({ cart, cartItems }); // Send the cart and its items as a response.
    } catch (err) {
        logger.error(`Error fetching cart: ${err.message}`);
        res.status(500).json({ message: "Server Error" }); // Handle server errors.
    }
};

/**
 * Adds a product to the user's cart.
 * @param {Object} req - The request object containing cart and product details.
 * @param {Object} res - The response object.
 */
const addProductToCart = async (req, res) => {
    try {
        const { userEmail, productId, quantity, price } = req.body;

        // Fetch user details by email.
        const user = await userModel.getUserByEmail(userEmail);
        if (!user) {
            logger.info(`User with email: ${userEmail} not found`);
            return res.status(400).json({ message: "Invalid user" });
        }

        // Add the product to the user's cart.
        const userId = user.user_id;
        logger.info(`Adding product with ID: ${productId} to cart`);
        const cart = await cartModel.getCartByUserId(userId);
        if (!cart) {
            // If no cart exists for the user, create a new one and add the product.
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

        // Update the cart with the product.
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

        // Update cart's total quantity and price.
        logger.info(`Updating cart total quantity and price`);
        const updatedCart = await cartModel.updateCart(
            cart.cart_id,
            quantity,
            price,
            "UPDATED"
        );

        res.json(updatedCart); // Send the updated cart as a response.
    } catch (err) {
        logger.error(`Error adding product to cart: ${err.message}`);
        res.status(500).json({ message: "Server Error" }); // Handle server errors.
    }
};

module.exports = {
    getCarts,
    getCartByUserEmail,
    addProductToCart,
};
