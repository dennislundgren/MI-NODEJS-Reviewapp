const { Schema, model } = require("mongoose");
const reviewsSchema = new Schema({
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: "Restaurants",
    required: true,
  },
  userId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
  title: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  date: { type: Number, required: true, default: Date.now() },
  description: String,
});


const ReviewModel = model("Review", reviewsSchema);

module.exports = ReviewModel;
