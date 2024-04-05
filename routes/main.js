const router = require("express").Router();
const { faker } = require("faker");
const Product = require("../models/product");
const Review = require("../models/review");
const mongoose = require("mongoose");

const createRandomProductId = () => {
  let product;
  let randomId;

  do {
    randomId = Math.floor(Math.random() * 10000);
    product = Product.find({ id: randomId });
  } while (product.length == 1);

  return randomId;
};

const createRandomReviewId = () => {
  let review;
  let randomId;

  do {
    randomId = Math.floor(Math.random() * 10000);
    review = Review.find({ id: randomId });
  } while (review.length == 1);

  return randomId;
};

router.get("/api/generate-fake-data", async (req, res, next) => {
  try {
    for (let i = 0; i < 90; i++) {
      let product = new Product();

      let id = createRandomProductId();

      product.id = id;
      product.category = faker.commerce.department();
      product.name = faker.commerce.productName();
      product.price = faker.commerce.price();
      product.reviews = [];

      for (let j = 0; j < 5; j++) {
        let review = new Review();
        review.userName = faker.internet.userName();
        review.text = faker.lorem.sentence();
        review.product = product.id;
        review.id = createRandomReviewId();
        product.reviews.push(review);
        await review.save();
      }

      await product.save();
    }
    res.end();
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.get("/api/products", async (req, res, next) => {
  try {
    const perPage = 9;
    const page = req.query.page || 1;
    const category = req.query.category;
    const price = req.query.price;
    const search = req.query.search;

    let query = {};

    const regex = new RegExp(search, "i");

    if (search) {
      query = { name: { $regex: regex } };
    }

    if (category) {
      query.category = category;
    }

    let sortQuery = {};
    if (price === "low-to-high") {
      sortQuery.price = 1;
    } else if (price === "high-to-low") {
      sortQuery.price = -1;
    }

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortQuery)
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate("reviews", { strictPopulate: false })
      .exec();

    const pages = Math.ceil(count / perPage);

    res.json({ products, pages });
  } catch (err) {
    next(err);
  }
});

router.get("/api/products/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.findOne({ id }).populate("reviews", {
      strictPopulate: false,
    });

    if (product == null) {
      return res.status(404).json("Product does not exist");
    } else {
      res.json(product);
      next();
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.get("/api/products/:id/reviews", async (req, res, next) => {
  try {
    const id = req.params.id;

    const product = await Product.findOne({ id }).populate("reviews", {
      strictPopulate: false,
    });

    if (product == null) {
      return res.status(404).json("Product does not exist");
    } else {
      const reviews = product.reviews.map((review) => {
        return {
          id: review.id,
          product: review.product,
          userName: review.userName,
          text: review.text,
        };
      });
      res.json(reviews);
      next();
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/api/categories", async (req, res, next) => {
  try {
    const categories = await Product.distinct("category");
    res.json(categories);
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.post("/api/products", async (req, res, next) => {
  try {
    const newProduct = {
      ...req.body,
      id: createRandomProductId(),
    };

    const matchingProduct = await Product.findOne({ name: newProduct.name });

    if (matchingProduct) {
      return res.status(400).json("Product with that name already exists");
    } else if (newProduct.price < 0) {
      return res.status(400).json("Price must be greater than 0");
    } else {
      await Product.create(newProduct);

      const retProduct = await Product.findOne({ id: newProduct.id });

      res.json(retProduct);

      next();
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.post("/api/products/:id/reviews", async (req, res, next) => {
  try {
    const id = req.params.id;

    const product = await Product.findOne({ id });

    if (product == null) {
      return res.status(404).json("Product does not exist");
    } else if (req.body.text == null || req.body.userName == null) {
      return res
        .status(400)
        .json("Review must have both a text and a username");
    } else {
      const review = {
        ...req.body,
        product: id,
        id: createRandomReviewId(),
      };

      await Review.create(review);
      const newReview = await Review.findOne({ id: req.body.id });
      res.json(newReview);
      next();
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.delete("/api/products/:id", async (req, res, next) => {
  try {
    const id = req.params.id;

    const product = await Product.findOne({ id });

    if (!product) {
      return res.status(404).json("Product does not exist");
    }

    await Product.deleteOne({ id: id });

    res.end();

    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.delete("/api/reviews/:id", async (req, res, next) => {
  try {
    const id = req.params.id;

    const review = await Review.findOne({ id });

    if (!review) {
      return res.status(404).json("Review does not exist");
    }

    await Review.deleteOne({ id: id });

    res.end();
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
