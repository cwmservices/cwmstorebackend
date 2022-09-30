const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  quantity: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  imgUrl: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
});

const Products = mongoose.model("PRODUCT", productSchema);

module.exports = Products;
