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

    if (reviews) {
      res.locals.reviews = await helpers.getReviewParams(
        reviews,
        res.locals.id
      );
    } else {
      res.locals.noReviews = true;
    }
    if (restaurants) {
      res.locals.restaurants = await helpers.getRestaurantsRating(restaurants);
    } else {
      res.locals.noRestaurants = true;
    }

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
  const { reviews, restaurants } = await helpers.getSearchResults(
    req.query.q,
    res.locals.id
  );

  res.locals.reviews = reviews;
  res.locals.restaurants = restaurants;
  res.render("explore", { explorePage: true });
});
/////////////
// LISTEN //
///////////
app.listen(port, host, () => {
  console.log(`Listening to http://${host}:${port}`);
});
