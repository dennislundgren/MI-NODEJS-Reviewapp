require("dotenv").config()
require("./mongoose.js")
const express = require ("express")
const exphbs = require("express-handlebars");
const port = 8080

const app = express()
app.engine("hbs", exphbs.engine({
    defaultLayout: "main",
    extname: ".hbs",
    helpers: require("./helpers")
}))
app.set("view engine", "hbs")
app.use(express.static("public"))
app.use(express.urlencoded({extended: true}))

//app.use("/restaurants", require("./routes/restaurant-router"));
app.use("/reviews", require("./routes/review-router"));

app.get("/", (req,res) => {
    res.send("Hello World!")
})

app.listen(port, () => {
    console.log("http://localhost:" + port);
})