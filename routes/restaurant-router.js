const express = require("express");
const RestaurantModel = require("../models/restaurant");
const { generateID } = require("../utils");

const router = express.Router();

router.get("/:id", async (req, res) => {
    const restaurant = await RestaurantModel.findOne({id: req.params.id}).lean()
    console.log(restaurant)
    res.send(restaurant)

})

router.get("/register", async (req, res) => {
    res.render("register-restaurant")
})
router.get("/edit/:id", async (req, res) => {
    const restaurant = await RestaurantModel.findOne({id: req.params.id}).lean()
    const reviews = await RevievModel.find({restaurantId: req.params.id}).lean()

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