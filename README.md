# Node.js Express Backend for [Project Name]

## Overview

This backend implementation is part of a technical test for a job interview. It leverages Node.js and Express, utilizing a REST API with an API key for enhanced security. The data is managed using a PostgreSQL database.

## Technology Stack

-   **Backend Framework**: Node.js with Express
-   **API Type**: RESTful API
-   **Database**: PostgreSQL
-   **Authentication**: Custom implementation in `authController`

## Installation

Follow these steps to set up the project:

1. Clone the repository:
   git clone [repository-url]

2. Install dependencies:
   npm install

3. Set up the PostgreSQL database:

-   Install PostgreSQL if not already installed.
-   Create a database for the project.
-   Run the `netvalue_shop_db_setup.sql` script to set up the database schema.

4. Configure environment variables:

-   Set the database connection details in a `.env` file.

5. Start the server:
   node ./src/app.js

## Running Tests

To run the unit tests, including the authentication controller tests, use the following command:

npm test

This will run all the test cases covering:

-   Successful login
-   User not found scenario
-   Incorrect password handling
-   Server error simulation

## Usage

Provide details on how to interact with the API, including endpoints and expected request/response formats.

## Contact

For any queries or contributions, feel free to contact me at [your-email] or open an issue in this repository.

---

Replace `[Project Name]`, `[repository-url]`, and `[your-email]` with the actual project name, repository URL, and your contact email, respectively.
