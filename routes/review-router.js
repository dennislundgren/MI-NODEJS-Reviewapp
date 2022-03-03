const express = require("express");
const ReviewModel = require("../models/review.js");

const router = express.Router();

router.get("/", async (req, res) => {
  res.render("review/write-new");
});

router.post("/", async (req, res) => {
  //const user = UsersModel.find(req.cookies.något med user)
  const newReview = new ReviewModel({
    restaurantId: req.body.restaurantId,
    //userId: user,
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
