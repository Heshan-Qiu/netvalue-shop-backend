const userModel = require("../src/models/userModel");
const pool = require("../src/models/db");

// Mock the database pool object to isolate tests from the database.
jest.mock("../src/models/db", () => ({
    query: jest.fn(),
}));

// Describe a test suite for the getUserByEmail function.
describe("getUserByEmail", () => {
    beforeEach(() => {
        pool.query.mockReset();
    });

    // Test case: Should return a user with the given email.
    it("should return a user with the given email", async () => {
        const mockUser = {
            user_id: 1,
            username: "testuser",
            password: "testpassword",
            role: "user",
            first_name: "Test",
            last_name: "User",
            email: "test@test.com",
        };
        pool.query.mockResolvedValue({ rows: [mockUser], rowCount: 1 });

        const user = await userModel.getUserByEmail("test@test.com");

        expect(pool.query).toHaveBeenCalledWith(
            "SELECT * FROM netvalue_shop_users WHERE email = $1",
            ["test@test.com"]
        );
        expect(user).toEqual(mockUser);
    });

    // Test case: Should return undefined if no user is found.
    it("should return undefined if no user is found", async () => {
        pool.query.mockResolvedValue({ rows: [], rowCount: 0 });

        const user = await userModel.getUserByEmail("test@test.com");

        expect(pool.query).toHaveBeenCalledWith(
            "SELECT * FROM netvalue_shop_users WHERE email = $1",
            ["test@test.com"]
        );
        expect(user).toBeUndefined();
    });

    // Test case: Should throw an error if the database query throws an error.
    it("should throw an error if the database query throws an error", async () => {
        pool.query.mockRejectedValue(new Error("Database error"));

        await expect(userModel.getUserByEmail("test@test.com")).rejects.toThrow(
            "Database error"
        );
    });
});
