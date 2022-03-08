const express = require("express");
const cookies = require("cookie-parser")
const RestaurantModel = require("../models/restaurant");
//  const ReviewModel = require("./models/review.js")

const router = express.Router();


router.get("/register", async (req, res) => {
    console.log(res.locals._id)
    res.render("restaurants/register")
})
router.get("/:id", async (req, res) => {
    const restaurant = await RestaurantModel.findOne({id: req.params.id}).lean()
    // const reviews = await ReviewModel.find({restaurantId: restaurant._id});
    console.log(restaurant)
    res.render("restaurants/view", {
        restaurant
    })

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
    res.render("restaurants/view")
})

router.post("/register", async (req,res) => {
    const newRestaurant = new RestaurantModel(req.body);
    try {
        await newRestaurant.save()
    } catch (err) {
        console.log(err.message)
    }
    res.redirect(`/restaurants/${newRestaurant._id}`)
})

module.exports = router