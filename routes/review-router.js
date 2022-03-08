const express = require("express");
const ReviewModel = require("../models/review.js");
const RestaurantModel = require("../models/restaurant.js");

const router = express.Router();

router.get("/write-new", async (req, res) => {
  if (res.locals.loggedIn) {
    const restaurants = await RestaurantModel.find().lean();
    console.log(restaurants);
    res.render("review/write-new", { restaurants });
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
  //Kan jag göra populate om det finns flera reviews med samma restaurant id??
  //Borde vara så??
  //Hitta genom review id?
  let review = undefined;
  let restaurant = undefined;
  try {
    review = await ReviewModel.findById(req.params.id).lean();
    restaurant = await RestaurantModel.findById(review.restaurantId).lean();
    // Jag har råkat skapa dummy-data som inte är riktiga object-id:n

    console.log(review.restaurantId);
    console.log(restaurant);
  } catch (error) {
    console.log(error.message);
    next(); //Fixa allmän error sida
  }

  res.render("review/review-edit", { review, restaurant });
});

router.post("/edit/:id", async (rew, res, next) => {
  review = await ReviewModel.findById(req.params.id).lean();

  review.title = req.body.title;
  review.description = req.body.description;
  review.rating = req.body.rating;

  await review.save();
});

module.exports = router;
