//////////////
// IMPORTS //
////////////
const ReviewModel = require("./models/review");
const RestaurantModel = require("./models/restaurant");
const { UsersModel } = require("./models/UsersModel");
//////////////
// HELPERS //
////////////
const helpers = {
  formatDate: (time) => {
    const date = new Date(time);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  },
  /*
   * Tillägger relevanta parametrar.
   */
  getReviewParams: async (reviews, localId) => {
    for (let i = 0; i < reviews.length; i++) {
      const user = await UsersModel.findById(reviews[i].userId);
      const restaurant = await RestaurantModel.findById(
        reviews[i].restaurantId
      );
      reviews[i].displayName = user.displayName;
      reviews[i].restaurantName = restaurant.name;
      reviews[i].kitchenType = restaurant.kitchenType;
      let dateObject = new Date(reviews[i].date);
      let date = ("0" + dateObject.getDate()).slice(-2);
      let year = dateObject.getFullYear().toString();
      let month = ("0" + (dateObject.getMonth() + 1)).slice(-2);
      let monthString = getMonth(parseInt(month));
      let dateString = date + " " + monthString + " " + year;
      reviews[i].date = dateString;
      if (localId == reviews[i].userId) {
        reviews[i].myReview = true;
      }
    }

    return reviews.slice(0, 10);
  },
  /*
   * Tilldelar restaurants rating samt sorterar dessa efter högst rating.
   */
  getRestaurantsRating: async (restaurants) => {
    for (let i = 0; i < restaurants.length; i++) {
      const reviews = await ReviewModel.find({
        restaurantId: restaurants[i]._id,
      });

      for (let j = 0; j < reviews.length; j++) {
        restaurants[i].rating += reviews[j].rating;
      }

      restaurants[i].rating = restaurants[i].rating / reviews.length;
    }

    if (restaurants > 1)
      restaurants.sort((a, b) => {
        return b.rating - a.rating;
      });

    if (restaurants > 1) restaurants.slice(0, 5);
    return restaurants;
  },
  /*
   * Hämtar sökresultat från query-parameter.
   * Diversifiera helpers-variabel för att minska upprepande kod.
   * Görs om tid blir över.
   */
  getSearchResults: async (q, localId) => {
    let reviews = await ReviewModel.find({
      $or: [
        { description: { $regex: q, $options: "i" } },
        { title: { $regex: q, $options: "i" } },
      ],
    }).lean();
    let restaurants = await RestaurantModel.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { address: { $regex: q, $options: "i" } },
        { kitchenType: { $regex: q, $options: "i" } },
      ],
    }).lean();

    reviews = await getSearchReviewParams(reviews, localId);
    restaurants = await getSearchRestaurantsRating(restaurants);

    return { reviews, restaurants };
  },
};
/*
 * Är för närvarande samma funktion som getReviewParams i helpers-objekt.
 * Diversifieras om tid blir över.
 */
async function getSearchReviewParams(reviews, localId) {
  for (let i = 0; i < reviews.length; i++) {
    const user = await UsersModel.findById(reviews[i].userId);
    const restaurant = await RestaurantModel.findById(reviews[i].restaurantId);
    reviews[i].displayName = user.displayName;
    reviews[i].restaurantName = restaurant.name;
    reviews[i].kitchenType = restaurant.kitchenType;
    if (localId == reviews[i].userId) {
      reviews[i].myReview = true;
    }
  }

  return reviews.slice(0, 10);
}
/*
 * Samma gäller denna funktion.
 * Diversifieras om tid blir över.
 */
async function getSearchRestaurantsRating(restaurants) {
  for (let i = 0; i < restaurants.length; i++) {
    const reviews = await ReviewModel.find({
      restaurantId: restaurants[i]._id,
    });

    for (let j = 0; j < reviews.length; j++) {
      restaurants[i].rating += reviews[j].rating;
    }

    restaurants[i].rating = restaurants[i].rating / reviews.length;
  }

  restaurants.sort((a, b) => {
    return b.rating - a.rating;
  });

  restaurants.slice(0, 5);
  return restaurants;
}
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
//////////////
// EXPORTS //
////////////
module.exports = helpers;
