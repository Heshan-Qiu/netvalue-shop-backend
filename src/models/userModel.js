// models/userModel.js
// Purpose: User model for interacting with the database.

const pool = require("./db");
const logger = require("../logger");

// Retrieves a user by their email
const getUserByEmail = async (email) => {
    logger.info(`Fetching user with email: ${email}`);
    const result = await pool.query(
        "SELECT * FROM netvalue_shop_users WHERE email = $1",
        [email]
    );
    return result.rows[0];
};

module.exports = {
    getUserByEmail,
};
