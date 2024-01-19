//instead of attatching paths to server we will attach it on router.
const express = require("express");
const {
  addToCart,
  fetchCartByUser,
  deleteFromCart,
  updateCart,
} = require("../controller/Cart");

const router = express.Router();

router
  .post("/", addToCart) // /cart is already added in base path
  .get("/", fetchCartByUser)
  .delete("/:id", deleteFromCart)
  .patch("/:id", updateCart);

exports.router = router;
