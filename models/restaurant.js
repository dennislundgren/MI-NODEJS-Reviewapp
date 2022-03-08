const { Schema, model} = require("mongoose")
// const { generateID } = require("../utils")

const restaurantSchema = new Schema({
    userId: {type:Schema.Types.ObjectId, ref: "users"},
    name: {type:String, required: true, unique: true},
    address: {type:String, required:true},
    rating: {type:Number, required:true, default: 1, min: 1, max: 5},
    kitchenType: {type:String, required:true, enum: ["american", "chinese", "italian", "japanese", "other"]},
    
})

const RestaurantModel = model("restaurants", restaurantSchema)

module.exports = RestaurantModel