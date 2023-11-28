const productModel = require("../src/models/productModel");
const pool = require("../src/models/db");

// Mock the database pool object to isolate tests from the database.
jest.mock("../src/models/db", () => ({
    query: jest.fn(),
}));

// Describe a test suite for the getProductById function.
describe("getProductById", () => {
    beforeEach(() => {
        pool.query.mockReset();
    });

    // Test case: Should return a product for a given id.
    it("should return a product for a given id", async () => {
        const mockProduct = {
            id: 1,
            name: "product1",
            sku: "sku1",
            price: 100,
            description: "description1",
            imageUrl: "image_url1",
        };
        pool.query.mockResolvedValue({ rows: [mockProduct], rowCount: 1 });

        const product = await productModel.getProductById(1);

        expect(pool.query).toHaveBeenCalledWith(
            "SELECT * FROM netvalue_shop_products WHERE id = $1",
            [1]
        );
        expect(product).toEqual(mockProduct);
    });

    // Test case: Should return undefined if no product is found.
    it("should return undefined if no product is found", async () => {
        pool.query.mockResolvedValue({ rows: [], rowCount: 0 });

        const product = await productModel.getProductById(1);

        expect(pool.query).toHaveBeenCalledWith(
            "SELECT * FROM netvalue_shop_products WHERE id = $1",
            [1]
        );
        expect(product).toBeUndefined();
    });

    // Test case: Should throw an error if the query fails.
    it("should throw an error if the query fails", async () => {
        pool.query.mockRejectedValue(new Error("DB Error"));

        await expect(productModel.getProductById(1)).rejects.toThrow(
            "DB Error"
        );

        expect(pool.query).toHaveBeenCalledWith(
            "SELECT * FROM netvalue_shop_products WHERE id = $1",
            [1]
        );
    });
});

// Describe a test suite for the getProductBySku function.
describe("createProduct", () => {
    beforeEach(() => {
        pool.query.mockReset();
    });

    // Test case: Should return a product for a given sku.
    it("should create a new product", async () => {
        const mockProduct = {
            name: "product1",
            sku: "sku1",
            price: 100,
            description: "description1",
            imageUrl: "image_url1",
        };
        const insertedProduct = { id: 1, ...mockProduct };
        pool.query.mockResolvedValue({ rows: [insertedProduct], rowCount: 1 });

        const product = await productModel.createProduct(mockProduct);

        expect(pool.query).toHaveBeenCalledWith(
            "INSERT INTO netvalue_shop_products (name, sku, price, description, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [
                mockProduct.name,
                mockProduct.sku,
                mockProduct.price,
                mockProduct.description,
                mockProduct.imageUrl,
            ]
        );
        console.debug("product: " + product);
        console.debug("insertedProduct: " + insertedProduct);
        expect(product).toEqual(insertedProduct);
    });

    // Test case: Should throw an error if the query fails.
    it("should throw an error if the query fails", async () => {
        const mockProduct = {
            name: "product1",
            sku: "sku1",
            price: 100,
            description: "description1",
            imageUrl: "image_url1",
        };
        pool.query.mockRejectedValue(new Error("DB Error"));

        await expect(productModel.createProduct(mockProduct)).rejects.toThrow(
            "DB Error"
        );

        expect(pool.query).toHaveBeenCalledWith(
            "INSERT INTO netvalue_shop_products (name, sku, price, description, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [
                mockProduct.name,
                mockProduct.sku,
                mockProduct.price,
                mockProduct.description,
                mockProduct.imageUrl,
            ]
        );
    });
});

// Describe a test suite for the getProductBySku function.
describe("updateProduct", () => {
    beforeEach(() => {
        pool.query.mockReset();
    });

    // Test case: Should return a product for a given sku.
    it("should update a product", async () => {
        const mockProduct = {
            id: 1,
            name: "product1",
            sku: "sku1",
            price: 100,
            description: "description1",
            imageUrl: "image_url1",
        };
        pool.query.mockResolvedValue({ rows: [mockProduct], rowCount: 1 });

        const product = await productModel.updateProduct(1, mockProduct);

        expect(pool.query).toHaveBeenCalledWith(
            "UPDATE netvalue_shop_products SET name = $1, sku = $2, price = $3, description = $4, image_url = $5 WHERE id = $6 RETURNING *",
            [
                mockProduct.name,
                mockProduct.sku,
                mockProduct.price,
                mockProduct.description,
                mockProduct.imageUrl,
                1,
            ]
        );
        expect(product).toEqual(mockProduct);
    });

    // Test case: Should throw an error if the query fails.
    it("should throw an error if the query fails", async () => {
        const mockProduct = {
            id: 1,
            name: "product1",
            sku: "sku1",
            price: 100,
            description: "description1",
            imageUrl: "image_url1",
        };
        pool.query.mockRejectedValue(new Error("DB Error"));

        await expect(
            productModel.updateProduct(1, mockProduct)
        ).rejects.toThrow("DB Error");

        expect(pool.query).toHaveBeenCalledWith(
            "UPDATE netvalue_shop_products SET name = $1, sku = $2, price = $3, description = $4, image_url = $5 WHERE id = $6 RETURNING *",
            [
                mockProduct.name,
                mockProduct.sku,
                mockProduct.price,
                mockProduct.description,
                mockProduct.imageUrl,
                1,
            ]
        );
    });
});

// Describe a test suite for the getProductBySku function.
describe("deleteProduct", () => {
    beforeEach(() => {
        pool.query.mockReset();
    });

    // Test case: Should return a product for a given sku.
    it("should delete a product", async () => {
        const mockProduct = {
            id: 1,
            name: "product1",
            sku: "sku1",
            price: 100,
            description: "description1",
            imageUrl: "image_url1",
        };
        pool.query.mockResolvedValue({ rows: [mockProduct], rowCount: 1 });

        const product = await productModel.deleteProduct(1);

        expect(pool.query).toHaveBeenCalledWith(
            "DELETE FROM netvalue_shop_products WHERE id = $1 RETURNING *",
            [1]
        );
        expect(product).toEqual(mockProduct);
    });

    // Test case: Should throw an error if the query fails.
    it("should throw an error if the query fails", async () => {
        pool.query.mockRejectedValue(new Error("DB Error"));

        await expect(productModel.deleteProduct(1)).rejects.toThrow("DB Error");

        expect(pool.query).toHaveBeenCalledWith(
            "DELETE FROM netvalue_shop_products WHERE id = $1 RETURNING *",
            [1]
        );
    });
});

// Describe a test suite for the getProductBySku function.
describe("getTotalProductCount", () => {
    beforeEach(() => {
        pool.query.mockReset();
    });

    // Test case: Should return a product for a given sku.
    it("should return the total number of products", async () => {
        pool.query.mockResolvedValue({ rows: [{ count: 5 }], rowCount: 1 });

        const totalProductCount = await productModel.getTotalProductCount();

        expect(pool.query).toHaveBeenCalledWith(
            "SELECT COUNT(*) FROM netvalue_shop_products",
            []
        );
        expect(totalProductCount).toEqual({ count: 5 });
    });

    // Test case: Should throw an error if the query fails.
    it("should return the total number of products matching a search term", async () => {
        pool.query.mockResolvedValue({ rows: [{ count: 5 }], rowCount: 1 });

        const totalProductCount = await productModel.getTotalProductCount(
            "search"
        );

        expect(pool.query).toHaveBeenCalledWith(
            "SELECT COUNT(*) FROM netvalue_shop_products WHERE name ILIKE $1 OR sku ILIKE $1 OR price::text ILIKE $1 OR description ILIKE $1",
            ["%search%"]
        );
        expect(totalProductCount).toEqual({ count: 5 });
    });

    // Test case: Should throw an error if the query fails.
    it("should throw an error if the query fails", async () => {
        pool.query.mockRejectedValue(new Error("DB Error"));

        await expect(productModel.getTotalProductCount()).rejects.toThrow(
            "DB Error"
        );

        expect(pool.query).toHaveBeenCalledWith(
            "SELECT COUNT(*) FROM netvalue_shop_products",
            []
        );
    });
});

// Describe a test suite for the getProductBySku function.
describe("getProducts", () => {
    beforeEach(() => {
        pool.query.mockReset();
    });

    // Test case: Should return a list of products with search, page, and limit.
    it("should return a list of products without search, page, or limit", async () => {
        const mockProducts = [
            {
                id: 1,
                name: "product1",
                sku: "sku1",
                price: 100,
                description: "description1",
                imageUrl: "image_url1",
            },
            {
                id: 2,
                name: "product2",
                sku: "sku2",
                price: 200,
                description: "description2",
                imageUrl: "image_url2",
            },
        ];
        pool.query.mockResolvedValue({ rows: mockProducts, rowCount: 2 });

        const products = await productModel.getProducts();

        expect(pool.query).toHaveBeenCalledWith(
            "SELECT * FROM netvalue_shop_products",
            []
        );
        expect(products).toEqual(mockProducts);
    });

    // Test case: Should return a list of products with search, page, and limit.
    it("should return a list of products with search, page, and limit", async () => {
        const mockProducts = [
            {
                id: 1,
                name: "product1",
                sku: "sku1",
                price: 100,
                description: "description1",
                imageUrl: "image_url1",
            },
            {
                id: 2,
                name: "product2",
                sku: "sku2",
                price: 200,
                description: "description2",
                imageUrl: "image_url2",
            },
        ];
        pool.query.mockResolvedValue({ rows: mockProducts, rowCount: 2 });

        const products = await productModel.getProducts("search", 1, 10);

        expect(pool.query).toHaveBeenCalledWith(
            "SELECT * FROM netvalue_shop_products WHERE name ILIKE $1 OR sku ILIKE $1 OR price::text ILIKE $1 OR description ILIKE $1 OFFSET $2 LIMIT $3",
            ["%search%", 0, 10]
        );
        expect(products).toEqual(mockProducts);
    });

    // Test case: Should return a list of products with search and without page or limit.
    it("should return a list of products with search and without page or limit", async () => {
        const mockProducts = [
            {
                id: 1,
                name: "product1",
                sku: "sku1",
                price: 100,
                description: "description1",
                imageUrl: "image_url1",
            },
            {
                id: 2,
                name: "product2",
                sku: "sku2",
                price: 200,
                description: "description2",
                imageUrl: "image_url2",
            },
        ];
        pool.query.mockResolvedValue({ rows: mockProducts, rowCount: 2 });

        const products = await productModel.getProducts("search");

        expect(pool.query).toHaveBeenCalledWith(
            "SELECT * FROM netvalue_shop_products WHERE name ILIKE $1 OR sku ILIKE $1 OR price::text ILIKE $1 OR description ILIKE $1",
            ["%search%"]
        );
        expect(products).toEqual(mockProducts);
    });

    // Test case: Should return a list of products with page and limit and without search.
    it("should return a list of products with page and limit and without search", async () => {
        const mockProducts = [
            {
                id: 1,
                name: "product1",
                sku: "sku1",
                price: 100,
                description: "description1",
                imageUrl: "image_url1",
            },
            {
                id: 2,
                name: "product2",
                sku: "sku2",
                price: 200,
                description: "description2",
                imageUrl: "image_url2",
            },
        ];
        pool.query.mockResolvedValue({ rows: mockProducts, rowCount: 2 });

        const products = await productModel.getProducts(null, 1, 10);

        expect(pool.query).toHaveBeenCalledWith(
            "SELECT * FROM netvalue_shop_products OFFSET $1 LIMIT $2",
            [0, 10]
        );
        expect(products).toEqual(mockProducts);
    });

    // Test case: Should return an empty array if no products are found.
    it("should throw an error if the query fails", async () => {
        pool.query.mockRejectedValue(new Error("DB Error"));

        await expect(productModel.getProducts()).rejects.toThrow("DB Error");

        expect(pool.query).toHaveBeenCalledWith(
            "SELECT * FROM netvalue_shop_products",
            []
        );
    });
});
