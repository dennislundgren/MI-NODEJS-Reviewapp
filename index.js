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
// Ta bort kommentar för att sätta på din port.
// const port = 80;
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
 * Hämtar lokala variabler man kan använda över hela "domänen".
 */
app.use(async (req, res, next) => {
  if (res.locals.loggedIn) {
    const reviews = await ReviewModel.find(
      {},
      {},
      { sort: { date: -1 }, limit: 10 }
    ).lean();
    const restaurants = await RestaurantModel.find().lean();

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

    for (let i = 0; i < restaurants.length; i++) {
      const user = await UsersModel.findById(restaurants[i].userId);
      const reviews = await ReviewModel.find({
        restaurantId: restaurants[i]._id,
      });

      restaurants[i].displayName = user.displayName;
      for (let j = 0; j < reviews.length; j++) {
        restaurants[i].rating += reviews[j].rating;
      }

      restaurants[i].rating = restaurants[i].rating / reviews.length;
    }

    restaurants.sort((a, b) => {
      return b.rating - a.rating;
    });

    res.locals.reviews = reviews;
    res.locals.restaurants = restaurants;

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
app.get("/", (req, res) => {
  if (res.locals.loggedIn) {
    res.render("explore", { explorePage: true });
  } else {
    res.redirect("/login");
  }
});
/////////////
// LISTEN //
///////////
app.listen(port, host, () => {
  console.log(`Listening to http://${host}:${port}`);
});
