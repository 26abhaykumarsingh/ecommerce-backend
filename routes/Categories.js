//instead of attatching paths to server we will attach it on router.
const express = require("express");
const { fetchCategories, createCategory } = require("../controller/Category");

const router = express.Router();

router
  .get("/", fetchCategories) // /categories is already added in base path
  .post("/", createCategory);

exports.router = router;
