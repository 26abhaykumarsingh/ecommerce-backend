//this will also work on User model but related to login/signup
const crypto = require("crypto");
var jwt = require("jsonwebtoken");

const { User } = require("../model/User");
const { sanitizeUser } = require("../services/common");

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
          //req.login given by passport, this also calls serializer and adds to session
          if (err) {
            res.status(400).json(err);
          } else {
            const token = jwt.sign(
              sanitizeUser(doc),
              process.env.JWT_SECRET_KEY
            ); //token will contain sanitised user info which but hidden, only server will be able to read it
            res
              .cookie("jwt", token, {
                expires: new Date(Date.now() + 3600000),
                httpOnly: true,
              })
              .status(201)
              .json({ id: doc.id, role: doc.role });
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

  const user = req.user;
  console.log("login User ", user);
  console.log("login user ", req.user.token);
  res
    .cookie("jwt", user.token, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    })
    .status(201)
    .json({ id: user.id, role: user.role }); //req.user is a special object made by passport after user is authenticated
};

exports.checkAuth = async (req, res) => {
  console.log("checkauth", req.user);
  if (req.user) {
    res.json(req.user);
  } else {
    res.sendStatus(401);
  }
};
