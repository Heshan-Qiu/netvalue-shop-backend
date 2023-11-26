const productModel = require("../models/productModel");

const getProductById = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await productModel.getProductById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
};

const createProduct = async (req, res) => {
    try {
        const product = req.body;
        const newProduct = await productModel.createProduct(product);
        res.json(newProduct);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
};

const updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const product = req.body;
        const updatedProduct = await productModel.updateProduct(id, product);
        res.json(updatedProduct);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedProduct = await productModel.deleteProduct(id);
        res.json(deletedProduct);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
};

const getProducts = async (req, res) => {
    try {
        const search = req.query.search || null;
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;

        const total = await productModel.getTotalProductCount(search);
        if (total.count === "0") {
            // Return empty data if no products found
            return res.json({
                page,
                totalPages: 0,
                limit,
                total: 0,
                data: [],
            });
        }

        const products = await productModel.getProducts(search, page, limit);

        res.json({
            page,
            totalPages: Math.ceil(total.count / limit),
            limit,
            total: total.count,
            data: products,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
