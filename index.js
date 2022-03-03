//////////////
// IMPORTS //
////////////
require("dotenv").config();
require("./mongoose.js");
const express = require("express");
const exphbs = require("express-handlebars");
const loginRouter = require("./routes/login-router");
const UsersModel = require("././models/UsersModel");
////////////////
// APP SETUP //
//////////////
// Ta bort kommentar för att sätta på din port.
// const port = 8080;
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
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use("/login", loginRouter);
app.use("/reviews", require("./routes/review-router"));
app.use("/restaurants", require("./routes/restaurant-router.js"));

app.get("/", (req, res) => {
  //////////////////////////////////////////////////////////////////////////////////////
  // REDIRECTAR FÖR ATT JAG INTE SKAPAT NÅGON FULLT FUNGERANDE ROUTE ÄNNU MVH DENNIS //
  ////////////////////////////////////////////////////////////////////////////////////
  res.redirect("/login");
  // res.render("home", { title: "Home" });
});
app.listen(port, host, () => {
  console.log(`Listening to http://${host}:${port}`);
});
