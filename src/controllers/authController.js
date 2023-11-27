// controllers/authController.js
// Purpose: Authentication controller for handling user login and registration.

require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const logger = require("../logger");
const userModel = require("../models/userModel");

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    logger.info(`Logging in user ${email}`);

    try {
        const user = await userModel.getUserByEmail(email);
        if (!user) {
            logger.warn(`User with email ${email} not found`);
            return res.status(400).send(`User with email ${email} not found`);
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            logger.warn(`Invalid password for user ${email}`);
            return res.status(400).send(`Invalid password for user ${email}`);
        }

        logger.info(`User ${email} logged in successfully`);
        const token = jwt.sign(
            { userId: user.user_id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        res.send({ token });
    } catch (error) {
        logger.error(`Error logging in user: ${error.message}`);
        res.status(500).send("Server Error");
    }
};

module.exports = {
    loginUser,
};
