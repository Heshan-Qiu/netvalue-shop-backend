# Node.js Express Backend for NetValue Shop

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
   git clone https://github.com/Heshan-Qiu/netvalue-shop-backend

2. Install dependencies:
   npm install

3. Set up the PostgreSQL database:

-   Install PostgreSQL if not already installed.
-   Create a database for the project.
-   Run the `netvalue_shop_db_setup.sql` script to set up the database schema.

4. Configure environment variables:

-   Set the database connection details in a `.env` file.
    POSTGRES_USER=
    POSTGRES_HOST=
    POSTGRES_PASSWORD=
    POSTGRES_DATABASE=
-   Set the server port, API key, and JWT secret in the `.env` file.
    PORT=
    API_KEY=
    JWT_SECRET=

5. Start the server:
   node ./src/app.js

## Running Tests

To run the unit tests, including the authentication controller tests, use the following command:

npm test

This will run all the test cases covering:

-   All model functions
-   Authentication controller, including:
    Successful login
    User not found scenario
    Incorrect password handling
    Server error simulation

## Usage

### Authentication

-   **Login**
    -   **Method**: POST
    -   **Endpoint**: `/auth/login`
    -   **Description**: Used for user authentication. Calls `loginUser` in `authController`.
    -   **Body**: JSON with user credentials.

### User Routes

-   **Get User by Email**
    -   **Method**: GET
    -   **Endpoint**: `/users/:email`
    -   **Description**: Retrieves a user by email. Handled by `getUserByEmail` in `userController`.
    -   **Parameters**: `email` - user's email.

### Product Routes

-   **Get Total Product Count**
    -   **Method**: GET
    -   **Endpoint**: `/products/total`
    -   **Description**: Retrieves total product count. Handled by `getTotalProductCount` in `productController`.
-   **Get Product by ID**
    -   **Method**: GET
    -   **Endpoint**: `/products/:id`
    -   **Description**: Retrieves a product by ID. Handled by `getProductById` in `productController`.
    -   **Parameters**: `id` - product ID.
-   **Create Product**
    -   **Method**: POST
    -   **Endpoint**: `/products/`
    -   **Description**: Creates a new product. Handled by `createProduct` in `productController`.
    -   **Body**: JSON with new product details.
-   **Update Product**
    -   **Method**: PUT
    -   **Endpoint**: `/products/:id`
    -   **Description**: Updates a product by ID. Handled by `updateProduct` in `productController`.
    -   **Parameters**: `id` - product ID.
    -   **Body**: JSON with updated product details.
-   **Delete Product**
    -   **Method**: DELETE
    -   **Endpoint**: `/products/:id`
    -   **Description**: Deletes a product by ID. Handled by `deleteProduct` in `productController`.
    -   **Parameters**: `id` - product ID.
-   **Get Products with Filters**
    -   **Method**: GET
    -   **Endpoint**: `/products/`
    -   **Description**: Retrieves products with filters. Handled by `getProducts` in `productController`.

### Cart Routes

-   **Get All Carts**
    -   **Method**: GET
    -   **Endpoint**: `/carts/`
    -   **Description**: Retrieves all carts. Handled by `getCarts` in `cartController`.
-   **Add Product to Cart**
    -   **Method**: POST
    -   **Endpoint**: `/carts/`
    -   **Description**: Adds a product to a cart. Handled by `addProductToCart` in `cartController`.
    -   **Body**: JSON with product and cart details.
-   **Get Cart by User Email**
    -   **Method**: GET
    -   **Endpoint**: `/carts/:userEmail`
    -   **Description**: Retrieves a cart by user's email. Handled by `getCartByUserEmail` in `cartController`.
    -   **Parameters**: `userEmail` - user's email.

## Contact

For any queries or contributions, feel free to contact me at heshan.chiu@gmail.com or open an issue in this repository.
