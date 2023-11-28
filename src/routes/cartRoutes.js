const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.get("/", cartController.getCarts);
router.post("/", cartController.addProductToCart);
router.get("/:userEmail", cartController.getCartByUserEmail);

module.exports = router;
