//instead of attatching paths to server we will attach it on router.

const express = require("express");
const { createUser, loginUser, checkUser } = require("../controller/Auth");
const passport = require("passport");

const router = express.Router();

router
  .post("/signup", createUser) // /auth is already added in base path
  .post("/login", passport.authenticate("local"), loginUser) //local is strategies name
  .get("/check", passport.authenticate("jwt"), checkUser); //local is strategies name

exports.router = router;
