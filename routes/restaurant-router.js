const express = require("express");
const cookies = require("cookie-parser");
const RestaurantModel = require("../models/restaurant");
const mongoose = require("mongoose");
const ReviewModel = require("../models/review");
//  const ReviewModel = require("./models/review.js")

const router = express.Router();

router.use(async (req, res, next) => {
  if (!res.locals.loggedIn) {
    res.redirect("/");
  }

  next();
});

router.get("/register", async (req, res) => {
  if (!res.locals.loggedIn) res.redirect("/login");
  res.render("restaurants/register");
});
router.get("/:id", async (req, res) => {
  if (!res.locals.loggedIn) res.redirect("/login");
  const restaurant = await RestaurantModel.findOne({
    _id: req.params.id,
  }).lean();
  // const reviews = await ReviewModel.find({restaurantId: restaurant._id});
  let reviews = await ReviewModel.find({ restairantId: req.params.id });
  reviews = [1, 2, 3];

  let isMine = false;
  if (res.locals.id)
    res.render("restaurants/view", {
      restaurant,
      reviews,
    });
});
router.get("/:id/edit", async (req, res) => {
  if (!res.locals.loggedIn) res.redirect("/login");
  const restaurant = await RestaurantModel.findOne({
    id: req.params.id,
  }).lean();
  // const reviews = await ReviewModel.find({restaurantId: req.params.id}).lean()

  res.render("edit-restaurant", {
    title: "Edit",
    restaurant,
  });
});
router.get("/", async (req, res) => {
  if (!res.locals.loggedIn) res.redirect("/login");
  let filter = {};
  let sort = [["rating", "desc"]];
  if (req.query.s == "greatest") sort = [["rating", "desc"]];
  const restaurants = await RestaurantModel.find(filter)
    .sort(sort)
    .limit(100)
    .lean();
  res.render("restaurants/view", { restaurantsPage: true });
});

router.post("/register", async (req, res) => {
  if (!res.locals.loggedIn) res.redirect("/login");
  let newRestaurant = {
    userId: mongoose.Types.ObjectId(res.locals.id),
    name: req.body.name,
    address: req.body.address,
    kitchenType: req.body.kitchenType,
  };
  newRestaurant = new RestaurantModel(newRestaurant);
  try {
    await newRestaurant.save();
  } catch (err) {
    console.log(err.code, err.message);
  }
  res.redirect(`/reviews/write-new?restaurant=${newRestaurant._id}`);
});

module.exports = router;
