//////////////
// IMPORTS //
////////////
const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { UsersModel } = require("../models/UsersModel");
const ReviewModel = require("../models/review");
const RestaurantsModel = require("../models/restaurant");
const RestaurantModel = require("../models/restaurant");
///////////////////
// ROUTER SETUP //
/////////////////
router.use(cookieParser());
//////////////////
// MIDDLEWARES //
////////////////
router.use(async (req, res, next) => {
  if (!res.locals.loggedIn) {
    res.redirect("/");
  }

  const reviews = await ReviewModel.find({ userId: res.locals.id }).lean();
  let totalRating = 0;
  for (let i = 0; i < reviews.length; i++) {
    const restaurant = await RestaurantsModel.findById(
      reviews[i].restaurantId
    ).lean();

    reviews[i].kitchenType = restaurant.kitchenType;
    reviews[i].name = restaurant.name;
    let dateObject = new Date(reviews[i].date);
    let date = ("0" + dateObject.getDate()).slice(-2);
    let year = dateObject.getFullYear().toString();
    let month = ("0" + (dateObject.getMonth() + 1)).slice(-2);
    let monthString = getMonth(parseInt(month));
    let dateString = date + " " + monthString + " " + year;
    reviews[i].date = dateString;
    totalRating += reviews[i].rating;
  }

  const restaurants = await RestaurantModel.find({
    userId: res.locals.id,
  }).lean();

  for (let i = 0; i < restaurants.length; i++) {
    const user = await UsersModel.findById(restaurants[i].userId);
    const reviews = await ReviewModel.find({
      restaurantId: restaurants[i]._id,
    });

    restaurants[i].displayName = user.displayName;
    for (let j = 0; j < reviews.length; j++) {
      restaurants[i].rating += reviews[j].rating;
    }

    restaurants[i].rating = restaurants[i].rating / reviews.length;
  }

  totalRating = totalRating / reviews.length;

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

  res.locals.totalReviews = reviews.length;
  res.locals.reviews = reviews;
  res.locals.totalRating = totalRating;

  res.locals.restaurants = restaurants;

  next();
});
/////////////
// ROUTES //
///////////
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  UsersModel.findById(id, (err, user) => {
    if (user && res.locals.loggedIn)
      res.render("profile", { profilePage: true, myReviews: true });
  });
});
router.get("/:id/restaurants", async (req, res) => {
  const id = req.params.id;
  UsersModel.findById(id, (err, user) => {
    if (user && res.locals.loggedIn)
      res.render("profile", { profilePage: true, myRestaurants: true });
  });
});
router.get("/:id/settings", async (req, res) => {
  const id = req.params.id;
  UsersModel.findById(id, (err, user) => {
    if (user && res.locals.loggedIn)
      res.render("profile", { profilePage: true, mySettings: true });
  });
});
router.post("/log-out", (req, res) => {
  res.cookie("token", "", { maxAge: 0 });
  res.redirect("/");
}); // Log out
//////////////
// EXPORTS //
////////////
module.exports = router;
