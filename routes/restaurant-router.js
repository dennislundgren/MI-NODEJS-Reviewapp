const express = require("express");
const RestaurantModel = require("../models/restaurant");
// const ReviweModel = require("./models/review.js")

const router = express.Router();

router.get("/:id", async (req, res) => {
    const restaurant = await RestaurantModel.findOne({id: req.params.id}).lean()
    console.log(restaurant)
    res.render("restaurants/view", {
        restaurant
    })

})

router.get("/register", async (req, res) => {
    res.render("register-restaurant")
})
router.get("/:id/edit", async (req, res) => {
    const restaurant = await RestaurantModel.findOne({id: req.params.id}).lean()
    // const reviews = await ReviewModel.find({restaurantId: req.params.id}).lean()

    res.render("edit-restaurant", {
        title: "Edit",
        restaurant
    })
})
router.get("/", async (req, res) => {
    let filter = {}
    let sort = [["rating", "desc"]]
    if (req.query.s == "greatest") sort = [["rating", "desc"]] 
    const restaurants = await RestaurantModel.find(filter).sort(sort).limit(100).lean()
    console.log(restaurants)
    res.send(restaurants);
})

module.exports = router