const express = require("express");
const RestaurantModel = require("../models/restaurant");
const { generateID } = require("../utils");

const router = express.Router();

router.get("/", async (req, res) => {
    let filter = {}
    let sort = [["_id", "desc"]]
    if (req.query.s == "greatest") sort = [["rating", "desc"]] 

    try {
        const restaurant = new RestaurantModel({
            id: generateID(),
            userId: "abcdefgh",
            name: "Pengatvättspizzerian",
            address: "Platshållargatan 1824",
            rating: 5,
            kitchenType: "italian"
        })
        await restaurant.save()
    } catch (err) {
        console.log(err);
    }
    const restaurants = await RestaurantModel.find(filter).sort(sort).limit(100).lean()
    console.log(restaurants)
    res.send(restaurants);
})
router.get("/register", async (req, res) => {
    res.render("register-restaurant")
})
router.get("/edit/:id", async (req, res) => {
    let restaurant;
    try {
        restaurant = await RestaurantModel.findOne({id: req.params.id})
    } catch (err) {
        console.log(err);
    }

    res.render("edit-restaurant", {
        title: "Edit",
        restaurant
    })
})

module.exports = router