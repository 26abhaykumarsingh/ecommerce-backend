const express = require("express");
const server = express();
const mongoose = require("mongoose");
const cors = require("cors");

const { createProduct } = require("./controller/Product");
const productsRouters = require("./routes/Products");
const categoriesRouters = require("./routes/Categories");
const brandsRouters = require("./routes/Brands");
const usersRouters = require("./routes/Users");
const authRouters = require("./routes/Auth");
const cartRouters = require("./routes/Cart");
const ordersRouters = require("./routes/Orders");

//middlewares
server.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
); //cuz we cant call one port from another, like 8080 from 3000
server.use(express.json()); //to parse req.body
server.use("/products", productsRouters.router); // /products is base path
server.use("/brands", brandsRouters.router);
server.use("/categories", categoriesRouters.router);
server.use("/users", usersRouters.router);
server.use("/auth", authRouters.router);
server.use("/cart", cartRouters.router);
server.use("/orders", ordersRouters.router);
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");
  console.log("database connected");
}

server.get("/", (req, res) => {
  res.json({ status: "success" });
});

server.listen(8080, () => {
  console.log("server started");
});
