//instead of attatching paths to server we will attach it on router.

const express = require("express");
const { createUser, loginUser } = require("../controller/Auth");

const router = express.Router();

router
  .post("/signup", createUser) // /auth is already added in base path
  .post("/login", loginUser);

exports.router = router;
