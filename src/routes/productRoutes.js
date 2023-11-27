const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/total", productController.getTotalProductCount);
router.get("/:id", productController.getProductById);
router.post("/", productController.createProduct);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);
router.get("/", productController.getProducts);

module.exports = router;
