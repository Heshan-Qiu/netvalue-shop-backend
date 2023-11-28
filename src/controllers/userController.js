const logger = require("../logger"); // Import the logger for logging information.
const userModel = require("../models/userModel"); // Import the userModel to interact with the user data.

/**
 * Controller function to retrieve a user by email.
 * @param {Object} req - The Express.js request object containing the request data.
 * @param {Object} res - The Express.js response object used to send back a response.
 */
const getUserByEmail = async (req, res) => {
    try {
        const email = req.params.email; // Extract the email from the request parameters.
        logger.info(`Fetching user with email: ${email}`); // Log the action of fetching the user.

        // Call the getUserByEmail method from userModel to retrieve the user.
        const user = await userModel.getUserByEmail(email);

        // Check if the user was found.
        if (!user) {
            logger.warn(`User with email: ${email} not found`); // Log a warning if the user is not found.
            return res.status(404).json({ message: "User not found" }); // Return a 404 Not Found response if the user is not found.
        }

        logger.info(`User with email: ${email} found`); // Log that the user was found.
        res.json(user); // Respond with the user data.
    } catch (err) {
        logger.error(`Error fetching user: ${err.message}`); // Log any errors that occur.
        res.status(500).json({ message: "Server Error" }); // Return a 500 Server Error response if an error occurs.
    }
};

module.exports = {
    getUserByEmail, // Export the getUserByEmail function for use in Express.js routes.
};
