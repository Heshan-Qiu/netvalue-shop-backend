const { Pool } = require("pg"); // Import the Pool class from the pg module.
require("dotenv").config(); // Load environment variables from a .env file.

// Create a new pool instance, which will manage multiple connections to the PostgreSQL database.
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL + "?sslmode=require", // Use the connection string from environment variables. Append SSL mode requirement for secure connection.
});

module.exports = pool; // Export the pool to be used elsewhere in the application.
