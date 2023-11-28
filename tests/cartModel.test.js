const cartModel = require("../src/models/cartModel");
const pool = require("../src/models/db");

// Mock the database pool object to isolate tests from the database.
jest.mock("../src/models/db", () => ({
    query: jest.fn(),
}));

// Describe a test suite for the getCartsWithUser function.
describe("getCartsWithUser", () => {
    beforeEach(() => {
        pool.query.mockReset();
    });

    // Test case: Should return carts with user.
    it("should return carts with user", async () => {
        const mockCarts = [
            {
                cart_id: 1,
                user_id: 1,
                total_quantity: 1,
                total_price: 1,
                status: "active",
                user_first_name: "John",
                user_last_name: "Doe",
                user_email: "test1@test.com",
            },
            {
                cart_id: 2,
                user_id: 2,
                total_quantity: 2,
                total_price: 2,
                status: "active",
                user_first_name: "Jane",
                user_last_name: "Doe",
                user_email: "test2@test.com",
            },
        ];
        pool.query.mockResolvedValue({ rows: mockCarts, rowCount: 2 });

        const carts = await cartModel.getCartsWithUser();

        expect(pool.query).toHaveBeenCalledWith(
            "SELECT c.cart_id, c.user_id, c.total_quantity, c.total_price, c.status, u.first_name AS user_first_name, u.last_name AS user_last_name, u.email AS user_email FROM netvalue_shop_carts c INNER JOIN netvalue_shop_users u ON c.user_id = u.user_id"
        );
        expect(carts).toEqual(mockCarts);
    });

    // Test case: Should return undefined if no cart is found.
    it("should return undefined if no cart is found", async () => {
        pool.query.mockResolvedValue({ rows: [], rowCount: 0 });

        const carts = await cartModel.getCartsWithUser();

        expect(pool.query).toHaveBeenCalledWith(
            "SELECT c.cart_id, c.user_id, c.total_quantity, c.total_price, c.status, u.first_name AS user_first_name, u.last_name AS user_last_name, u.email AS user_email FROM netvalue_shop_carts c INNER JOIN netvalue_shop_users u ON c.user_id = u.user_id"
        );
        expect(carts).toEqual([]);
    });

    // Test case: Should throw an error if the database query throws an error.
    it("should throw an error if the database query throws an error", async () => {
        pool.query.mockRejectedValue(new Error("Database error"));

        await expect(cartModel.getCartsWithUser()).rejects.toThrow(
            "Database error"
        );
    });
});

// Describe a test suite for the getCartByUserId function.
describe("getCartByUserId", () => {
    beforeEach(() => {
        pool.query.mockReset();
    });

    // Test case: Should return cart by user ID.
    it("should return cart by user ID", async () => {
        const mockCart = {
            cart_id: 1,
            user_id: 1,
            total_quantity: 1,
            total_price: 1,
            status: "active",
        };
        pool.query.mockResolvedValue({ rows: [mockCart], rowCount: 1 });

        const cart = await cartModel.getCartByUserId(1);

        expect(pool.query).toHaveBeenCalledWith(
            "SELECT * FROM netvalue_shop_carts WHERE user_id = $1",
            [1]
        );
        expect(cart).toEqual(mockCart);
    });

    // Test case: Should return undefined if no cart is found.
    it("should return undefined if no cart is found", async () => {
        pool.query.mockResolvedValue({ rows: [], rowCount: 0 });

        const cart = await cartModel.getCartByUserId(1);

        expect(pool.query).toHaveBeenCalledWith(
            "SELECT * FROM netvalue_shop_carts WHERE user_id = $1",
            [1]
        );
        expect(cart).toEqual(undefined);
    });

    // Test case: Should throw an error if the database query throws an error.
    it("should throw an error if the database query throws an error", async () => {
        pool.query.mockRejectedValue(new Error("Database error"));

        await expect(cartModel.getCartByUserId(1)).rejects.toThrow(
            "Database error"
        );
    });
});

// Describe a test suite for the createCart function.
describe("createCart", () => {
    beforeEach(() => {
        pool.query.mockReset();
    });

    // Test case: Should create a cart.
    it("should create a cart", async () => {
        const mockCart = {
            cart_id: 1,
            user_id: 1,
            total_quantity: 1,
            total_price: 1,
            status: "active",
        };
        pool.query.mockResolvedValue({ rows: [mockCart], rowCount: 1 });

        const cart = await cartModel.createCart(1, 1, 1, "active");

        expect(pool.query).toHaveBeenCalledWith(
            "INSERT INTO netvalue_shop_carts (user_id, total_quantity, total_price, status) VALUES ($1, $2, $3, $4) RETURNING *",
            [1, 1, 1, "active"]
        );
        expect(cart).toEqual(mockCart);
    });

    // Test case: Should throw an error if the database query throws an error.
    it("should throw an error if the database query throws an error", async () => {
        pool.query.mockRejectedValue(new Error("Database error"));

        await expect(cartModel.createCart(1, 1, 1, "active")).rejects.toThrow(
            "Database error"
        );
    });
});

// Describe a test suite for the updateCart function.
describe("updateCart", () => {
    beforeEach(() => {
        pool.query.mockReset();
    });

    // Test case: Should update a cart.
    it("should update a cart", async () => {
        const mockCart = {
            cart_id: 1,
            user_id: 1,
            total_quantity: 1,
            total_price: 1,
            status: "active",
        };
        pool.query.mockResolvedValue({ rows: [mockCart], rowCount: 1 });

        const cart = await cartModel.updateCart(1, 1, 1, "active");

        expect(pool.query).toHaveBeenCalledWith(
            "UPDATE netvalue_shop_carts SET total_quantity = total_quantity + $1, total_price = total_price + $2, status = $3 WHERE cart_id = $4 RETURNING *",
            [1, 1, "active", 1]
        );
        expect(cart).toEqual(mockCart);
    });

    // Test case: Should throw an error if the database query throws an error.
    it("should throw an error if the database query throws an error", async () => {
        pool.query.mockRejectedValue(new Error("Database error"));

        await expect(cartModel.updateCart(1, 1, 1, "active")).rejects.toThrow(
            "Database error"
        );
    });

    // Test case: Should return undefined if no cart is found.
    it("should return undefined if no cart is found", async () => {
        pool.query.mockResolvedValue({ rows: [], rowCount: 0 });
        const cart = await cartModel.updateCart(1, 1, 1, "active");
        expect(pool.query).toHaveBeenCalledWith(
            "UPDATE netvalue_shop_carts SET total_quantity = total_quantity + $1, total_price = total_price + $2, status = $3 WHERE cart_id = $4 RETURNING *",
            [1, 1, "active", 1]
        );
        expect(cart).toEqual(undefined);
    });
});
