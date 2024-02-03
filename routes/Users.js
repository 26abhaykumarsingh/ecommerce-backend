//instead of attatching paths to server we will attach it on router.

const express = require("express");
const { fetchUserById, updateUser } = require("../controller/User");

const router = express.Router();

router
  .post("/own", fetchUserById) // /users is already added in base path
  .patch("/:id", updateUser);

exports.router = router;
