//instead of attatching paths to server we will attach it on router.

const express = require("express");
const {
  createProduct,
  fetchAllProducts,
  fetchProductById,
  updateProduct,
} = require("../controller/Product");

const router = express.Router();

router
  .post("/", createProduct) // /products is already added in base path
  .get("/", fetchAllProducts)
  .get("/:id", fetchProductById)
  .patch("/:id", updateProduct);

exports.router = router;
