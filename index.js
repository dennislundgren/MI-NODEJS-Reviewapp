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
const UsersModel = require("././models/UsersModel");
const session = require("express-session");
////////////////
// APP SETUP //
//////////////
// Ta bort kommentar för att sätta på din port.
// const port = 80;
const port = 8080;
const host = "localhost";
const app = express();
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.engine(
  "hbs",
  exphbs.engine({
    defaultLayout: "main",
    extname: ".hbs",
    helpers: require("./helpers"),
  })
);
app.set("view engine", "hbs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use("/login", loginRouter);
app.use("/reviews", require("./routes/review-router"));
app.use("/restaurants", require("./routes/restaurant-router.js"));
app.use(cookieParser());
app.use((req, res, next) => {
  const { token } = req.cookies;
  if (token && jwt.verify(token, process.env.JWT_SECRET)) {
    const tokenData = jwt.decode(token, process.env.JWT_SECRET);
    res.locals.loggedIn = true;
    res.locals.displayName = tokenData.displayName;
  } else {
    res.locals.loggedIn = false;
  }
  next();
});
app.get("/", (req, res) => {
  if (res.locals.loggedIn) {
    res.render("home");
  } else {
    res.redirect("/login");
  }
});
app.listen(port, host, () => {
  console.log(`Listening to http://${host}:${port}`);
});
