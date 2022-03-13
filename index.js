/*
 * Vi som har medverkat i detta projekt är:
 * - Johanna Fryxell
 * - Dennis Lundgren
 * - Viggo Ohlsson
 */
//////////////
// IMPORTS //
////////////
require("dotenv").config();
require("./mongoose");
require("./passport");
const express = require("express");
const exphbs = require("express-handlebars");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const loginRouter = require("./routes/login-router");
const profileRouter = require("./routes/profile-router");
const session = require("express-session");
const ReviewModel = require("./models/review");
const RestaurantModel = require("./models/restaurant");
const { UsersModel } = require("./models/UsersModel");
const helpers = require("./helpers");
////////////////
// APP SETUP //
//////////////
const port = 8080;
const host = "localhost";
const app = express();
app.engine(
  "hbs",
  exphbs.engine({
    defaultLayout: "main",
    extname: ".hbs",
    helpers: require("./helpers"),
  })
);
app.set("view engine", "hbs");
//////////////////
// MIDDLEWARES //
////////////////
/*
 * Var tvungen att implementera express-session för att twitter
 * skulle fungera.
 */
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
/*
 * Middleware som ser om token för inlogg finns eller ej.
 */
app.use((req, res, next) => {
  const { token } = req.cookies;
  if (token && jwt.verify(token, process.env.JWT_SECRET)) {
    const tokenData = jwt.decode(token, process.env.JWT_SECRET);
    res.locals.loggedIn = true;
    res.locals.displayName = tokenData.displayName;
    res.locals.id = tokenData.id;
  } else {
    res.locals.loggedIn = false;
  }
  next();
});
/*
 * Middleware som hämtar de 10 senaste reviewsen samt
 * de 5 högst rankade restaurangerna.
 * Ifall vi får tid över så läggs dessa i helpers.js.
 */
app.use(async (req, res, next) => {
  if (res.locals.loggedIn) {
    const reviews = await ReviewModel.find(
      {},
      {},
      { sort: { date: -1 } }
    ).lean();

    const restaurants = await RestaurantModel.find().lean();

    /*
     * Behövde knyta ihop några fler parametrar för att
     * i appen kunna visa informationen korrekt.
     * displayName, restaurantName och kitchenType
     * används för att i hbs-en sen visa informationen på rätt
     * ställen mot reviews i explore-page.
     */
    for (let i = 0; i < reviews.length; i++) {
      const user = await UsersModel.findById(reviews[i].userId);
      const restaurant = await RestaurantModel.findById(
        reviews[i].restaurantId
      );
      reviews[i].displayName = user.displayName;
      reviews[i].restaurantName = restaurant.name;
      reviews[i].kitchenType = restaurant.kitchenType;
      if (res.locals.id == reviews[i].userId) {
        reviews[i].myReview = true;
      }
    }

    /*
     * Liksom reviews behövdes fler parametrar för front-end
     * att kunna visa information på korrekt sätt.
     */
    for (let i = 0; i < restaurants.length; i++) {
      const user = await UsersModel.findById(restaurants[i].userId);
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

    /*
     * Visa endast senaste 10 respektive top 5 reviews
     * och restauranger.
     */
    if (reviews.length <= 0) res.locals.noReviews = true;
    if (restaurants.length <= 0) res.locals.noRestaurants = true;

    res.locals.reviews = reviews.slice(0, 10);
    res.locals.restaurants = restaurants.slice(0, 5);

    next();
  } else {
    next();
  }
});
/////////////
// ROUTES //
///////////
app.use("/login", loginRouter);
app.use("/profile", profileRouter);
app.use("/reviews", require("./routes/review-router"));
app.use("/restaurants", require("./routes/restaurant-router.js"));
/*
 * Hade kunna lägga många felmeddelanden i msg-variable
 * istället för if/else-satser. explorePage är ett exempel.
 */
app.get("/", (req, res) => {
  if (res.locals.loggedIn) {
    res.render("explore", { explorePage: true });
  } else {
    res.redirect("/login");
  }
});
/*
 * En search-query för explore-sidan.
 * Hämtar för närvarande inte information som
 * överlappar collections.
 * Kitchentype, användare och restaurang hos reviews.
 * Användare, reviews desc och titel hos restaurants.
 */
app.get("/search/:q?", async (req, res) => {
  const reviews = await ReviewModel.find({
    $or: [
      { description: { $regex: req.query.q, $options: "i" } },
      { title: { $regex: req.query.q, $options: "i" } },
    ],
  }).lean();
  const restaurants = await RestaurantModel.find({
    $or: [
      { name: { $regex: req.query.q, $options: "i" } },
      { address: { $regex: req.query.q, $options: "i" } },
      { kitchenType: { $regex: req.query.q, $options: "i" } },
    ],
  }).lean();

  /*
   * Nedan är i princip samma kod som i middleware
   * för komplement i front-end parametrar.
   * Bör läggas i helpers.js ifall tid finns.
   */
  for (let i = 0; i < reviews.length; i++) {
    const user = await UsersModel.findById(reviews[i].userId);
    const restaurant = await RestaurantModel.findById(reviews[i].restaurantId);
    reviews[i].displayName = user.displayName;
    reviews[i].restaurantName = restaurant.name;
    reviews[i].kitchenType = restaurant.kitchenType;
    if (res.locals.id == reviews[i].userId) {
      reviews[i].myReview = true;
    }
  }

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

  if (reviews.length <= 0) res.locals.noSearchReviews = true;
  if (restaurants.length <= 0) res.locals.noSearchRestaurants = true;

  res.locals.reviews = reviews.slice(0, 10);
  res.locals.restaurants = restaurants.slice(0, 5);
  res.render("explore", { explorePage: true });
});
app.get("/:id", async (req, res) => {
  const review = await ReviewModel.findById(req.params.id).lean();
  const restaurant = await RestaurantModel.findById(review.restaurantId).lean();
  const user = await UsersModel.findById(review.userId).lean();
  review.displayName = user.displayName;
  review.kitchenType = restaurant.kitchenType;
  review.name = restaurant.name;
  let dateObject = new Date(review.date);
  let date = ("0" + dateObject.getDate()).slice(-2);
  let year = dateObject.getFullYear().toString();
  let month = ("0" + (dateObject.getMonth() + 1)).slice(-2);
  let monthString = getMonth(parseInt(month));
  let dateString = date + " " + monthString + " " + year;
  review.date = dateString;

  const reviews = await ReviewModel.find({ userId: review.userId }).lean();
  let totalRating = 0;
  for (let i = 0; i < reviews.length; i++) {
    totalRating += reviews[i].rating;
  }

  res.locals.totalRating = (totalRating / reviews.length).toFixed(2);
  res.locals.totalReviews = reviews.length;

  if (res.locals.id == review.userId) {
    review.myReview = true;
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
  res.render("read-review", { review, explorePage: true });
});
/////////////
// LISTEN //
///////////
app.listen(port, host, () => {
  console.log(`Listening to http://${host}:${port}`);
});
