require("dotenv").config();
require("./mongoose.js");
const express = require("express");
const exphbs = require("express-handlebars");
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

app.use("/restaurants", require("./routes/restaurant-router.js"));
// app.use("/reviews", require("./routes/review-router.js"));

app.get("/", (req, res) => {
  res.render("home", { title: "Home" });
});

app.listen(port, () => {
  console.log("http://localhost:" + port);
});
