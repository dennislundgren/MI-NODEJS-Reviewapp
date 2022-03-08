const express = require("express");
const ReviewModel = require("../models/review.js");
const RestaurantModel = require("../models/restaurant.js")

const router = express.Router();

router.get("/write-new", async (req, res) => {
  if (res.locals.loggedIn) {
    const restaurants = await RestaurantModel.find().lean()
    console.log(restaurants);
    res.render("review/write-new", {restaurants});
  } else {
    res.redirect("/login");
  }
});

router.post("/write-new/:id", async (req, res) => {
  const id = req.params.id;
  const newReview = new ReviewModel({
    restaurantId: req.body.restaurantId,
    userId: id,
    title: req.body.title,
    rating: req.body.rating,
    date: Date.now(),
    description: req.body.description,
  });

  await newReview.save();
  res.redirect("/reviews"); //Välj rätt senare
});

router.get("/edit/:id", async (req, res, next) => {
  const review = undefined;
  try {
    review = await ReviewModel.findById(id).populate("restaurantId").lean();
  } catch (error) {
    console.log(error.message);
    next(); //Fixa allmän error sida
  }

  res.render("reviews/review-edit", review);
});

module.exports = router;
