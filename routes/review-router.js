const express = require("express");
const ReviewModel = require("../models/review.js");
const RestaurantModel = require("../models/restaurant.js");
const { validateReview } = require(".././utils");

const router = express.Router();

router.use(async (req, res, next) => {
  if (!res.locals.loggedIn) {
    res.redirect("/");
  }

  next();
});

router.get("/write-new", async (req, res) => {
  if (res.locals.loggedIn) {
    const restaurants = await RestaurantModel.find().lean();
    res.render("review/write-new", { restaurants, writeNewPage: true });
  } else {
    res.redirect("/login");
  }
});

router.post("/write-new", async (req, res) => {
  const newReview = new ReviewModel({
    restaurantId: req.body.restaurantId,
    userId: res.locals.id,
    title: req.body.title,
    description: req.body.description,
    rating: req.body.rating,
    date: Date.now(),
  });

  if (validateReview(newReview)) {
    await newReview.save();
    res.redirect("/");
  } else {
    const restaurants = await RestaurantModel.find().lean();
    res.render("review/write-new", {
      textError: "You need to write something",
      restError: "You need to choose a restaurant",
      title: newReview.title,
      description: newReview.description,
      restaurantId: newReview.restaurantId,
      restaurants,
    });
  }
});

router.get("/edit/:id", async (req, res) => {
  if (res.locals.loggedIn) {
    let review = undefined;
    try {
      review = await ReviewModel.findById(req.params.id).lean();
    } catch {
      res.sendStatus(404);
    }

    if (res.locals.id == review.userId) {
      let restaurant = await RestaurantModel.findById(
        review.restaurantId
      ).lean();
      res.render("review/review-edit", { review, restaurant });
    } else {
      res.sendStatus(401);
    }
  } else {
    res.redirect("/login");
  }
});

router.post("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const review = await ReviewModel.findById(id).lean();

  review.title = req.body.title;
  review.description = req.body.description;
  review.rating = req.body.rating;

  if (validateReview(review)) {
    await ReviewModel.findByIdAndUpdate(
      { _id: review.restaurantId },
      {
        title: req.body.title,
        description: req.body.description,
        rating: req.body.rating,
      }
    );

    res.redirect("/");
  } else {
    let restaurant = await RestaurantModel.findById(review.restaurantId).lean();

    res.render("review/review-edit", {
      review,
      _id: id,
      restaurant,
      textError: "You need to write something",
    });
  }
});

router.get("/edit/:id/remove", async (req, res) => {
  if (res.locals.loggedIn) {
    let review = undefined;

    try {
      review = await ReviewModel.findById(req.params.id).lean();
    } catch {
      res.sendStatus(404);
    }

    if (res.locals.id == review.userId) {
      await ReviewModel.findByIdAndDelete(req.params.id);
      res.redirect("/");
    } else {
      res.sendStatus(401);
    }
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
