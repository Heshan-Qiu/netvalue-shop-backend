const cartItemModel = require("../src/models/cartItemModel");
const pool = require("../src/models/db");

// Mock the database pool object to isolate tests from the database.
jest.mock("../src/models/db", () => ({
    query: jest.fn(),
}));

// Describe a test suite for the getCartItems function.
describe("getCardItem", () => {
    // Reset the mock before each test.
    beforeEach(() => {
        pool.query.mockReset();
    });

    // Test case: Should return cart items with the given cart ID.
    it("should return a cart item with the given cart ID and product ID", async () => {
        const mockCartItem = {
            cart_item_id: 1,
            cart_id: 1,
            product_id: 1,
            quantity: 1,
            price: 10,
        };
        pool.query.mockResolvedValue({ rows: [mockCartItem], rowCount: 1 });

        const cartItem = await cartItemModel.getCartItem(1, 1);

        expect(pool.query).toHaveBeenCalledWith(
            "SELECT * FROM netvalue_shop_cart_items WHERE cart_id = $1 AND product_id = $2",
            [1, 1]
        );
        expect(cartItem).toEqual(mockCartItem);
    });

    // Test case: Should return undefined if no cart item is found.
    it("should return undefined if no cart item is found", async () => {
        pool.query.mockResolvedValue({ rows: [], rowCount: 0 });

        const cartItem = await cartItemModel.getCartItem(1, 1);

        expect(pool.query).toHaveBeenCalledWith(
            "SELECT * FROM netvalue_shop_cart_items WHERE cart_id = $1 AND product_id = $2",
            [1, 1]
        );
        expect(cartItem).toBeUndefined();
    });

    // Test case: Should throw an error if the database query throws an error.
    it("should throw an error if the database query throws an error", async () => {
        pool.query.mockRejectedValue(new Error("Database error"));

        await expect(cartItemModel.getCartItem(1, 1)).rejects.toThrow(
            "Database error"
        );
    });
});

// Describe a test suite for the getCartItemsWithProductNameAndImage function.
describe("getCartItemsWithProductNameAndImage", () => {
    beforeEach(() => {
        pool.query.mockReset();
    });

    // Test case: Should return cart items with the given cart ID.
    it("should return cart items with the given cart ID", async () => {
        const mockCartItems = [
            {
                cart_item_id: 1,
                cart_id: 1,
                product_id: 1,
                quantity: 1,
                price: 10,
                product_name: "Product 1",
                product_image_url: "https://example.com/image1.jpg",
            },
            {
                cart_item_id: 2,
                cart_id: 1,
                product_id: 2,
                quantity: 2,
                price: 20,
                product_name: "Product 2",
                product_image_url: "https://example.com/image2.jpg",
            },
        ];
        pool.query.mockResolvedValue({ rows: mockCartItems, rowCount: 2 });

        const cartItems =
            await cartItemModel.getCartItemsWithProductNameAndImage(1);

        expect(pool.query).toHaveBeenCalledWith(
            "SELECT c.cart_item_id, c.cart_id, c.product_id, c.quantity, c.price, p.name AS product_name, p.image_url AS product_image_url FROM netvalue_shop_cart_items c INNER JOIN netvalue_shop_products p ON c.product_id = p.id WHERE cart_id = $1",
            [1]
        );
        expect(cartItems).toEqual(mockCartItems);
    });

    // Test case: Should return an empty array if no cart items are found.
    it("should return an empty array if no cart items are found", async () => {
        pool.query.mockResolvedValue({ rows: [], rowCount: 0 });

        const cartItems =
            await cartItemModel.getCartItemsWithProductNameAndImage(1);

        expect(pool.query).toHaveBeenCalledWith(
            "SELECT c.cart_item_id, c.cart_id, c.product_id, c.quantity, c.price, p.name AS product_name, p.image_url AS product_image_url FROM netvalue_shop_cart_items c INNER JOIN netvalue_shop_products p ON c.product_id = p.id WHERE cart_id = $1",
            [1]
        );
        expect(cartItems).toEqual([]);
    });

    // Test case: Should throw an error if the database query throws an error.
    it("should throw an error if the database query throws an error", async () => {
        pool.query.mockRejectedValue(new Error("Database error"));

        await expect(
            cartItemModel.getCartItemsWithProductNameAndImage(1)
        ).rejects.toThrow("Database error");
    });
});

// Describe a test suite for the createCartItem function.
describe("createCartItem", () => {
    beforeEach(() => {
        pool.query.mockReset();
    });

    // Test case: Should create a cart item with the given cart ID, product ID, quantity and price.
    it("should create a cart item with the given cart ID, product ID, quantity and price", async () => {
        const mockCartItem = {
            cart_item_id: 1,
            cart_id: 1,
            product_id: 1,
            quantity: 1,
            price: 10,
        };
        pool.query.mockResolvedValue({ rows: [mockCartItem], rowCount: 1 });

        const cartItem = await cartItemModel.createCartItem(1, 1, 1, 10);

        expect(pool.query).toHaveBeenCalledWith(
            "INSERT INTO netvalue_shop_cart_items (cart_id, product_id, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *",
            [1, 1, 1, 10]
        );
        expect(cartItem).toEqual(mockCartItem);
    });

    // Test case: Should throw an error if the database query throws an error.
    it("should throw an error if the database query throws an error", async () => {
        pool.query.mockRejectedValue(new Error("Database error"));

        await expect(cartItemModel.createCartItem(1, 1, 1, 10)).rejects.toThrow(
            "Database error"
        );
    });
});

// Describe a test suite for the updateCartItem function.
describe("updateCartItem", () => {
    beforeEach(() => {
        pool.query.mockReset();
    });

    // Test case: Should update a cart item with the given cart item ID, quantity and price.
    it("should update a cart item with the given cart item ID, quantity and price", async () => {
        const mockCartItem = {
            cart_item_id: 1,
            cart_id: 1,
            product_id: 1,
            quantity: 1,
            price: 10,
        };
        pool.query.mockResolvedValue({ rows: [mockCartItem], rowCount: 1 });

        const cartItem = await cartItemModel.updateCartItem(1, 1, 10);

        expect(pool.query).toHaveBeenCalledWith(
            "UPDATE netvalue_shop_cart_items SET quantity = quantity + $1, price = price + $2 WHERE cart_item_id = $3 RETURNING *",
            [1, 10, 1]
        );
        expect(cartItem).toEqual(mockCartItem);
    });

    // Test case: Should throw an error if the database query throws an error.
    it("should throw an error if the database query throws an error", async () => {
        pool.query.mockRejectedValue(new Error("Database error"));

        await expect(cartItemModel.updateCartItem(1, 1, 10)).rejects.toThrow(
            "Database error"
        );
    });

    // Test case: Should return undefined if the cart item ID is not found.
    it("should return undefined if the cart item ID is not found", async () => {
        pool.query.mockResolvedValue({ rows: [], rowCount: 0 });

        const cartItem = await cartItemModel.updateCartItem(1, 1, 10);

        expect(pool.query).toHaveBeenCalledWith(
            "UPDATE netvalue_shop_cart_items SET quantity = quantity + $1, price = price + $2 WHERE cart_item_id = $3 RETURNING *",
            [1, 10, 1]
        );
        expect(cartItem).toBeUndefined();
    });
});
