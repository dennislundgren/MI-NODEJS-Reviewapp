const { Schema, model } = require("mongoose");

const restaurantSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
  name: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  rating: { type: Number, required: true, default: 0 },
  kitchenType: {
    type: String,
    required: true,
    enum: ["american", "chinese", "italian", "japanese", "other"],
  },
});

const RestaurantModel = model("restaurants", restaurantSchema);

module.exports = RestaurantModel;
