//////////////
// IMPORTS //
////////////
const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { UsersModel } = require("../models/UsersModel");
///////////////////
// ROUTER SETUP //
/////////////////
router.use(cookieParser());
/////////////
// ROUTES //
///////////
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  UsersModel.findById(id, (err, user) => {
    if (user && res.locals.loggedIn) res.render("profile");
  });
});
router.post("/log-out", (req, res) => {
  res.cookie("token", "", { maxAge: 0 });
  res.redirect("/");
}); // Log out
//////////////
// EXPORTS //
////////////
module.exports = router;
