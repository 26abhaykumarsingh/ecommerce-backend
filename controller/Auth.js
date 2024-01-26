//this will also work on User model but related to login/signup
const crypto = require("crypto");
var jwt = require("jsonwebtoken");

const { User } = require("../model/User");
const { sanitizeUser } = require("../services/common");
const SECRET_KEY = "SECRET_KEY";

exports.createUser = async (req, res) => {
  //this product we have to get from API body
  try {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        //this also calls serializer and adds to session
        const user = new User({ ...req.body, password: hashedPassword, salt });
        const doc = await user.save();

        req.login(sanitizeUser(doc), (err) => {
          if (err) {
            res.status(400).json(err);
          } else {
            const token = jwt.sign(sanitizeUser(doc), SECRET_KEY); //token will contain sanitised user info which but hidden, only server will be able to read it
            res.status(201).json(token);
          }
        });
      }
    );
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.loginUser = async (req, res) => {
  // try {
  //   const user = await User.findOne({ email: req.body.email }).exec();
  //   // TODO: this is just temporary, we will use strong password auth
  //   if (!user) {
  //     res.status(401).json({ message: "no such user email" });
  //   } else if (user.password === req.body.password) {
  //     // TODO: We will make addresses independent of login
  //     res.status(200).json({
  //       id: user.id,
  //       role: user.role,
  //     });
  //   } else {
  //     res.status(401).json({ message: "invalid credentials" });
  //   }
  // } catch (err) {
  //   res.status(400).json(err);
  // }

  //above part is handled in index.js in authentication now

  res.json(req.user);
};

exports.checkUser = async (req, res) => {
  res.json({ status: "success", user: req.user });
};
