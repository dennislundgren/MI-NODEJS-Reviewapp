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
  res.render("restaurants/register", { writeNewPage: true });
});
router.get("/:id", async (req, res) => {
  if (!res.locals.loggedIn) res.redirect("/login");
  const restaurant = await RestaurantModel.findOne({
    _id: req.params.id,
  }).lean();
  const reviews = await ReviewModel.find({
    restaurantId: req.params.id,
  }).lean();

  let isMine = false;
  if (res.locals.id == restaurant.userId) isMine = true;


  let restaurantReviewsAmount = reviews.length;

  let restaurantRating = 0;
  for (let review of reviews) {
    restaurantRating += review.rating;
  }
  restaurantRating = restaurantRating / reviews.length;
  if (res.locals.id)
    res.render("restaurants/view", {
      restaurantRating,
      isMine,
      restaurant,
      reviews,
      restaurantsPage: true,
    });
});
router.get("/:id/edit", async (req, res) => {
  if (!res.locals.loggedIn) res.redirect("/login");
  const restaurant = await RestaurantModel.findOne({
    id: req.params.id,
  }).lean();
  if(res.locals.id != restaurant.userId) res.redirect("/")

  res.render("restaurants/edit", {
    restaurant,
    restaurantsPage: true,
  });
});
router.get("/", async (req, res) => {
  if (!res.locals.loggedIn) res.redirect("/login");
  let filter = {};
  if (req.query.filter) filter = { kitchenType: req.query.filter };
  let sort = [["rating", "desc"]];
  if (req.query.s == "best") sort = [["rating", "desc"]];
  if (req.query.s == "worst") sort = [["rating", "asc"]];
  const restaurants = await RestaurantModel.find(filter)
    .sort(sort)
    .limit(100)
    .lean();
  res.render("restaurants/list", {
    restaurants,
    restaurantsPage: true,
  });
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

router.post("/:id/edit", async (req,res) => {
  if (!res.locals.loggedIn) res.redirect("/login")
  const restaurant = await RestaurantModel.findById(req.params.id);

  restaurant.name = req.body.name;
  restaurant.address = req.body.address;

  await restaurant.save();
  res.redirect(`/restaurants/${restaurant._id}`);
}) 

module.exports = router;
