const express = require("express");
const ReviewModel = require("../models/review.js");
const RestaurantModel = require("../models/restaurant.js");
const { UsersModel } = require("../models/UsersModel");
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
    rating: req.body.rating,
    description: req.body.description,
    date: Date.now(),
  });

  // if(validateReview(newReview)){
  await newReview.save();
  res.redirect("/"); //Välj rätt senare
  // }else{
  //   const restaurants = await RestaurantModel.find().lean();
  //   res.render("review/write-new", {
  //     error: "Make sure to enter valid data!",
  //     restaurants
  //   })
  // }
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
  const review = await ReviewModel.findById(req.params.id);

  review.title = req.body.title;
  review.description = req.body.description;
  review.rating = req.body.rating;

  await review.save();
  res.redirect("/");
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

router.get("/:reviewId", async (req, res) => {
  try {
    const review = await ReviewModel.findById(req.params.reviewId).lean();
    const restaurant = await RestaurantModel.findById(
      review.restaurantId
    ).lean();
    const user = await UsersModel.findById(review.userId).lean();
    review.displayName = user.displayName;
    review.kitchenType = restaurant.kitchenType;
    review.name = restaurant.name;
    let dateObject = new Date(review.date);
    let date = ("0" + dateObject.getDate()).slice(-2);
    let year = dateObject.getFullYear().toString();
    let month = ("0" + (dateObject.getMonth() + 1)).slice(-2);
    let monthString = getMonth(parseInt(month));
    let dateString = date + " " + monthString + " " + year;
    review.date = dateString;

    const reviews = await ReviewModel.find({ userId: review.userId }).lean();
    let totalRating = 0;
    for (let i = 0; i < reviews.length; i++) {
      totalRating += reviews[i].rating;
    }

    res.locals.totalRating = (totalRating / reviews.length).toFixed(2);
    res.locals.totalReviews = reviews.length;

    if (res.locals.id == review.userId) {
      review.myReview = true;
    }

    function getMonth(x) {
      const month = [
        "January",
        "February",
        "Mars",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "November",
        "December",
      ];
      return month[x - 1];
    }
    res.render("read-review", { review, explorePage: true });
  } catch {}
});

module.exports = router;
