const logger = require("../logger");
const userModel = require("../models/userModel");

// Retrieves a user by its email
const getUserByEmail = async (req, res) => {
    try {
        const email = req.params.email;
        logger.info(`Fetching user with email: ${email}`);
        const user = await userModel.getUserByEmail(email);
        if (!user) {
            logger.warn(`User with email: ${email} not found`);
            return res.status(404).json({ message: "User not found" });
        }
        logger.info(`User with email: ${email} found`);
        res.json(user);
    } catch (err) {
        logger.error(`Error fetching user: ${err.message}`);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = {
    getUserByEmail,
};
