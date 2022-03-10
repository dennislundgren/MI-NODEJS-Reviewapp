const express = require("express");
const cookies = require("cookie-parser")
const RestaurantModel = require("../models/restaurant");
const mongoose = require("mongoose");
const ReviewModel = require("../models/review");

//  const ReviewModel = require("./models/review.js")

const router = express.Router();


router.get("/register", async (req, res) => {
    if (!res.locals.loggedIn)
        res.redirect("/login")
    console.log(res.locals)
    res.render("restaurants/register")
})
router.get("/:id", async (req, res) => {
    if (!res.locals.loggedIn)
        res.redirect("/login")
    const restaurant = await RestaurantModel.findOne({_id: req.params.id}).lean()
    const reviews = await ReviewModel.find({restaurantId: req.params.id})
    console.log(restaurant)
    console.log(res.locals)

    let isMine = false;
    if (res.locals.id == restaurant.userId)
        isMine = true

    res.render("restaurants/view", {
        isMine,
        restaurant,
        reviews
    })



})
router.get("/:id/edit", async (req, res) => {
    if (!res.locals.loggedIn)
        res.redirect("/login")
    const restaurant = await RestaurantModel.findOne({id: req.params.id}).lean()

    res.render("edit-restaurant", {
        title: "Edit",
        restaurant
    })
})
router.get("/", async (req, res) => {
    if (!res.locals.loggedIn)
        res.redirect("/login")
    let filter = {}
    if (req.query.filter)
        filter = {kitchenType: req.query.filter}
    let sort = [["rating", "desc"]]
    if (req.query.s == "best") sort = [["rating", "desc"]] 
    if (req.query.s == "worst") sort = [["rating", "asc"]] 
    const restaurants = await RestaurantModel.find(filter).sort(sort).limit(100).lean()
    // console.log(restaurants)
    res.render("restaurants/list", {
        restaurants
    })
})

router.post("/register", async (req,res) => {
    if (!res.locals.loggedIn)
        res.redirect("/login")
    let newRestaurant = {
        userId: mongoose.Types.ObjectId(res.locals.id),
        name: req.body.name,
        address: req.body.address,
        kitchenType: req.body.kitchenType,
    }
    console.log(newRestaurant);
    newRestaurant = new RestaurantModel(newRestaurant)
    console.log(newRestaurant)
    try {
        await newRestaurant.save()
    } catch (err) {
        console.log(err.code, err.message)
    }
    res.redirect(`/reviews/write-new?restaurant=${newRestaurant._id}`)
})

module.exports = router