//////////////
// IMPORTS //
////////////
require("dotenv").config();
require("./mongoose.js");
const express = require("express");
const exphbs = require("express-handlebars");
const signInRouter = require("./routes/sign-in-router");
const signUpRouter = require("./routes/sign-up-router");
////////////////
// APP SETUP //
//////////////
const port = 80;
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
app.use("/sign-in", signInRouter);
app.use("/sign-up", signUpRouter);
app.get("/", (req, res) => {
  res.redirect("/sign-in");
});
app.listen(port, () => {
  console.log("http://localhost:" + port);
});
