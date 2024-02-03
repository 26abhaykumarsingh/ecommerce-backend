const express = require("express");
const server = express();
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const crypto = require("crypto");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
var jwt = require("jsonwebtoken"); //to create token
const cookieParser = require("cookie-parser");

const { createProduct } = require("./controller/Product");
const productsRouters = require("./routes/Products");
const categoriesRouters = require("./routes/Categories");
const brandsRouters = require("./routes/Brands");
const usersRouters = require("./routes/Users");
const authRouters = require("./routes/Auth");
const cartRouters = require("./routes/Cart");
const ordersRouters = require("./routes/Orders");
const { User } = require("./model/User");
const { isAuth, sanitizeUser, cookieExtractor } = require("./services/common");

const SECRET_KEY = "SECRET_KEY";
//JWT options

const opts = {};
opts.jwtFromRequest = cookieExtractor; //helps us to extract the cookie from the client requests
opts.secretOrKey = SECRET_KEY; //TODO : should now be in code

//middlewares
server.use(express.static("build"));
server.use(cookieParser()); //enable us to read the cookies coming in the requests from clients
server.use(
  session({
    secret: "keyboard cat",
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  })
);
server.use(passport.authenticate("session"));

server.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
); //cuz we cant call one port from another, like 8080 from 3000
server.use(express.json()); //to parse req.body
server.use("/products", isAuth(), productsRouters.router); // we can also use JWT token for client-only auth
server.use("/brands", isAuth(), brandsRouters.router);
server.use("/categories", isAuth(), categoriesRouters.router);
server.use("/users", isAuth(), usersRouters.router);
server.use("/auth", authRouters.router);
server.use("/cart", isAuth(), cartRouters.router);
server.use("/orders", isAuth(), ordersRouters.router);

//Passport Strategies
passport.use(
  "local",
  new LocalStrategy({ usernameField: "email" }, async function (
    email,
    password,
    done
  ) {
    //by default passport uses username
    //below part is kinnda same as login code in auth.js
    try {
      const user = await User.findOne({ email: email }).exec();
      if (!user) {
        done(null, false, { message: "invalid credentials" }); //first argument is error
      }
      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          //hashed passowrd will be new password but it can be verified with user.password
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            done(null, false, { message: "invalid credentials" });
          } else {
            const token = jwt.sign(sanitizeUser(user), SECRET_KEY); //creating token, first argument is payload, second is secret key, //token will contain sanitised user info which but hidden, only server will be able to read it
            done(null, { id: user.id, role: user.role }); //this line sends to serializer
          }
        }
      );
    } catch (err) {
      done(err);
    }
  })
);

//jwt is generally used for api,it helps in having no dependency on server, if we have a token stored which we can send to server to check
passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    console.log({ jwt_payload });
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, sanitizeUser(user)); //this calls serializer
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

//this creates session variable req.user on being called from callbacks
passport.serializeUser(function (user, cb) {
  console.log("serialize", user);
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});
//after getting serialised, every request after that will contain req.user, if we are authennticated, this is what passport do, it creates a session in the server, req.user contains the session (?)

//this changes session variable req.user when called from authorised request
passport.deserializeUser(function (user, cb) {
  console.log("deserialize", user);
  process.nextTick(function () {
    return cb(null, user);
  });
});

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");
  console.log("database connected");
}

server.listen(8080, () => {
  console.log("server started");
});
