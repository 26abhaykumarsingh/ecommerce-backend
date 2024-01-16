//instead of attatching paths to server we will attach it on router.
const express = require("express");
const { fetchBrands, createBrand } = require("../controller/Brand");

const router = express.Router();

router
  .get("/", fetchBrands) // /brands is already added in base path
  .post("/", createBrand);

exports.router = router;
