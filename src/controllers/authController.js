require("dotenv").config(); // Load environment variables from .env file.

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const logger = require("../logger");
const userModel = require("../models/userModel");

const loginUser = async (req, res) => {
    const { email, password } = req.body; // Destructure email and password from request body.
    logger.info(`Logging in user ${email}`); // Log the login attempt.

    try {
        // Attempt to retrieve the user by email.
        const user = await userModel.getUserByEmail(email);
        if (!user) {
            logger.warn(`User with email ${email} not found`);
            return res.status(400).send(`User with email ${email} not found`); // Respond with error if user not found.
        }

        // Compare the provided password with the stored hashed password.
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            logger.warn(`Invalid password for user ${email}`);
            return res.status(400).send(`Invalid password for user ${email}`); // Respond with error if password is invalid.
        }

        // User authenticated, log success and create a JWT.
        logger.info(`User ${email} logged in successfully`);
        const token = jwt.sign(
            { userId: user.user_id, role: user.role }, // Payload of the token.
            process.env.JWT_SECRET, // Secret key for signing the token.
            { expiresIn: "1h" } // Token expiration time.
        );

        res.send({ token }); // Send the JWT as a response.
    } catch (error) {
        logger.error(`Error logging in user: ${error.message}`);
        res.status(500).send("Server Error"); // Handle server errors.
    }
};

module.exports = {
    loginUser,
};
