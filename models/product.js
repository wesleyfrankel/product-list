const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const productSchema = new Schema({
  category: String,
  name: String,
  price: Number,
  image: String,
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
});
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
