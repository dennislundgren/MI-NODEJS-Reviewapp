//////////////
// IMPORTS //
////////////
const express = require("express");
const router = express.Router();
const UsersModel = require(".././models/UsersModel");
const { getHashedPassword } = require(".././utils");
/////////////
// ROUTES //
///////////
router.get("/", async (req, res) => {
  const signIn = true;
  res.render("login", { signIn });
}); // Sign-in page
router.get("/sign-up", async (req, res) => {
  const signIn = false;
  res.render("login", { signIn });
}); // Sign-up page
router.post("/sign-in", async (req, res) => {});
router.post("/sign-up", async (req, res) => {
  const { username, password, confirmPassword } = req.body;
  const signIn = false;

  UsersModel.find({ username }, async (err, user) => {
    if (user) {
      const userExists = true;
      res.render("login", { signIn, userExists });
    } else if (password !== confirmPassword) {
      const wrongPassword = true;
      res.render("login", { signIn, wrongPassword });
    } else {
      const newUser = new UsersModel({
        username,
        password: getHashedPassword(password),
      });
      await newUser.save();
      res.redirect("/login");
    }
  });
  const newUser = new UsersModel({
    username: req.body.username,
    password: req.body.password,
  });

  await newUser.save();
  res.redirect("/");
});
//////////////
// EXPORTS //
////////////
module.exports = router;
