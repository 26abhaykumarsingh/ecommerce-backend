//instead of attatching paths to server we will attach it on router.
const express = require("express");
const {
  createOrder,
  fetchOrderByUser,
  deleteOrder,
  updateOrder,
} = require("../controller/Order");

const router = express.Router();

router
  .post("/", createOrder) // /orders is already added in base path
  .get("/", fetchOrderByUser)
  .delete("/:id", deleteOrder)
  .patch("/:id", updateOrder);

exports.router = router;
