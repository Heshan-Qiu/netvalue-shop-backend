const userModel = require("../src/models/userModel");
const pool = require("../src/models/db");

jest.mock("../src/models/db", () => ({
    query: jest.fn(),
}));

describe("getUserByEmail", () => {
    beforeEach(() => {
        pool.query.mockReset();
    });

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

    it("should return undefined if no user is found", async () => {
        pool.query.mockResolvedValue({ rows: [], rowCount: 0 });

        const user = await userModel.getUserByEmail("test@test.com");

        expect(pool.query).toHaveBeenCalledWith(
            "SELECT * FROM netvalue_shop_users WHERE email = $1",
            ["test@test.com"]
        );
        expect(user).toBeUndefined();
    });

    it("should throw an error if the database query throws an error", async () => {
        pool.query.mockRejectedValue(new Error("Database error"));

        await expect(userModel.getUserByEmail("test@test.com")).rejects.toThrow(
            "Database error"
        );
    });
});
