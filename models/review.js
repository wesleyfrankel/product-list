const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Product = require("./product.js");

const reviewSchema = new Schema({
  username: String,
  text: String,
  product: [{ type: Schema.Types.ObjectId, ref: "Product" }],
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
