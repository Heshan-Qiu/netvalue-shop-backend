// models/userModel.js
// This module defines the User model for database interactions. It provides methods to interact with user data in the database.

const pool = require("./db"); // Import the database pool for making queries.
const logger = require("../logger"); // Import the logger for logging information.

/**
 * Retrieves a user from the database based on their email address.
 * @param {string} email - The email address of the user to be retrieved.
 * @returns {Promise<Object>} A promise that resolves to the user object if found, otherwise undefined.
 */
const getUserByEmail = async (email) => {
    logger.info(`Fetching user with email: ${email}`);
    const result = await pool.query(
        "SELECT * FROM netvalue_shop_users WHERE email = $1", // SQL query to find a user by email.
        [email] // The email parameter to be used in the SQL query.
    );
    return result.rows[0]; // Returns the first row (user) from the query result, if available.
};

module.exports = {
    getUserByEmail, // Export the getUserByEmail function for use in other parts of the application.
};
