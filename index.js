const express = require("express");
const app = express();
const productRoutes = require("./productRoutes");

require("./db/conn");

app.use(express.static("public"));

const cors = require("cors");

const products = require("./Products.json");
const posts = require("./posts.json");

const Products = require("./db/models/products");
const Posts = require("./db/models/posts");

// const importData = async () => {
//   try {
//     await Products.deleteMany({});
//     await Products.insertMany(products);

//     await Posts.deleteMany({});
//     await Posts.insertMany(posts);

//     await console.log("data inserted");
//   } catch (error) {
//     console.log(error);
//   }
// };

// importData();

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    credentials: true,
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

app.use(productRoutes);

app.listen(PORT, (req, res) => {
  console.log(`server running on port ${PORT}`);
});
