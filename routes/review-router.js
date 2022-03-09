const express = require("express");
const ReviewModel = require("../models/review.js");
const RestaurantModel = require("../models/restaurant.js");
const { validateReview } = require(".././utils");

const router = express.Router();

router.get("/write-new", async (req, res) => {
  if (res.locals.loggedIn) {
    const restaurants = await RestaurantModel.find().lean();
    res.render("review/write-new", { restaurants });
  } else {
    res.redirect("/login");
  }
});

router.post("/write-new/:id", async (req, res) => {
  const id = req.params.id; //Här är req.params.id = inloggad användare
  const newReview = new ReviewModel({
    restaurantId: req.body.restaurantId,
    userId: id,
    title: req.body.title,
    rating: req.body.rating,
    date: Date.now(),
    description: req.body.description,
  });

  await newReview.save();
  res.redirect("/"); //Välj rätt senare
});

router.get("/edit/:id", async (req, res, next) => {
  let review = undefined;

  try {
    //Kollar om det finns en review med det id:t
    review = await ReviewModel.findById(req.params.id).lean();
  } catch {
    res.sendStatus(404);
    //Skriva in ett errormeddelande istället
  }

  if (res.locals.id == review.userId) {
    let restaurant = await RestaurantModel.findById(review.restaurantId).lean();
    res.render("review/review-edit", { review, restaurant });
  } else {
    res.sendStatus(401);
  }
});

router.post("/edit/:id", async (req, res, next) => {
  const review = await ReviewModel.findById(req.params.id);

  review.title = req.body.title;
  review.description = req.body.description;
  review.rating = req.body.rating;

  await review.save();
  res.redirect("/");
});

module.exports = router;
