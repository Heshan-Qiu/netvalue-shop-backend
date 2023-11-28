const { loginUser } = require("../src/controllers/authController"); // Import the loginUser function from the authentication controller.
const userModel = require("../src/models/userModel"); // Import the user model.
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing.
const jwt = require("jsonwebtoken"); // Import jsonwebtoken for token generation.

// Mock the userModel, bcrypt, and jsonwebtoken to isolate tests from external dependencies.
jest.mock("../src/models/userModel");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

// Describe a test suite for the loginUser function.
describe("loginUser", () => {
    // Test case: Should return a token for a valid user.
    it("should return a token for a valid user", async () => {
        // Mock request and response objects.
        const mockRequest = {
            body: {
                email: "test@example.com",
                password: "password123",
            },
        };
        const mockResponse = {
            send: jest.fn(), // Mock send function.
        };

        // Setup mocks for the user model and bcrypt.
        userModel.getUserByEmail.mockResolvedValue({
            user_id: 1,
            email: "test@example.com",
            password: "hashedpassword",
            role: "user",
        });
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue("mockToken");

        // Call the loginUser function with the mocked request and response.
        await loginUser(mockRequest, mockResponse);

        // Assert that the response's send function was called with the expected token.
        expect(mockResponse.send).toHaveBeenCalledWith({ token: "mockToken" });
    });

    // Test case: Should return 400 if user does not exist.
    it("should return 400 if user does not exist", async () => {
        // Mock request and response objects for a non-existent user.
        const mockRequest = {
            body: { email: "nonexistent@example.com", password: "password123" },
        };
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        // Setup the user model mock to return null.
        userModel.getUserByEmail.mockResolvedValue(null);

        // Call the loginUser function.
        await loginUser(mockRequest, mockResponse);

        // Assert that the response's status and send functions were called with the expected values.
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.send).toHaveBeenCalledWith(
            "User with email nonexistent@example.com not found"
        );
    });

    // Test case: Should return 400 if password is incorrect.
    it("should return 400 if password is incorrect", async () => {
        // Mock request and response objects for a valid user but incorrect password.
        const mockRequest = {
            body: { email: "test@example.com", password: "wrongpassword" },
        };
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        // Setup mocks to simulate an incorrect password scenario.
        userModel.getUserByEmail.mockResolvedValue({
            user_id: 1,
            email: "test@example.com",
            password: "hashedpassword",
            role: "user",
        });
        bcrypt.compare.mockResolvedValue(false);

        // Call the loginUser function.
        await loginUser(mockRequest, mockResponse);

        // Assert the response's status and send functions were called correctly.
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.send).toHaveBeenCalledWith(
            "Invalid password for user test@example.com"
        );
    });

    // Test case: Should return 500 if there is a server error.
    it("should return 500 if there is a server error", async () => {
        // Mock request and response objects.
        const mockRequest = {
            body: { email: "test@example.com", password: "password123" },
        };
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        // Setup the user model mock to throw an error.
        userModel.getUserByEmail.mockRejectedValue(
            new Error("Internal server error")
        );

        // Call the loginUser function.
        await loginUser(mockRequest, mockResponse);

        // Assert that the response's status and send functions were called with server error information.
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.send).toHaveBeenCalledWith("Server Error");
    });
});
