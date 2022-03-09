//////////////
// IMPORTS //
////////////
require("../passport");
const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
const { UsersModel } = require(".././models/UsersModel");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { hashPassword, comparePassword } = require(".././utils");
/////////////////////
// ROUTE SETTINGS //
///////////////////
router.use(cookieParser());
///////////////////
// LOGIN ROUTES //
/////////////////
router.get("/", async (req, res) => {
  if (res.locals.loggedIn) {
    res.redirect("/");
  } else {
    res.render("login", { signIn: true });
  }
}); // Sign-in page
router.get("/sign-up", async (req, res) => {
  res.render("login", { signIn: false });
}); // Sign-up page
router.post("/sign-in", async (req, res) => {
  const { username, password, rememberMe } = req.body;

  UsersModel.findOne({ username }, (err, user) => {
    if (user && comparePassword(password, user.password)) {
      const userData = { displayName: user.displayName, id: user._id };
      const accessToken = jwt.sign(userData, process.env.JWT_SECRET);

      if (rememberMe) {
        res.cookie("token", accessToken, { maxAge: 3600000 });
      } else {
        res.cookie("token", accessToken);
      }
      res.redirect("/");
    } else if (user && !comparePassword(password, user.password)) {
      res.render("login", { signIn: true, wrongPassword: true });
    } else {
      res.render("login", { signIn: true, loginFailed: true });
    }
  });
}); // Sign in POST
router.post("/sign-up", async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  UsersModel.findOne({ username }, async (err, user) => {
    if (user) {
      res.render("login", { signIn: false, userExists: true });
    } else if (password !== confirmPassword) {
      res.render("login", { signIn: false, wrongPassword: true });
    } else if (!password || !confirmPassword) {
      res.render("login", { signIn: false, wrongPassword: true });
    } else {
      const newUser = new UsersModel({
        username,
        password: hashPassword(password),
        displayName: username,
      });
      await newUser.save();
      res.redirect("/login");
    }
  });
}); // Sign up POST
router.post("/log-out", async (req, res) => {
  res.cookie("token", "", { maxAge: 0 });
  res.redirect("/");
}); // Log out
router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
); // Google auth.
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
  }),
  async (req, res) => {
    UsersModel.findOne({ googleId: req.user.id }, async (err, user) => {
      const userData = { displayName: req.user.displayName };

      if (user) {
        userData.id = user._id;
      } else {
        const newUser = new UsersModel({
          googleId: req.user.id,
          displayName: req.user.displayName,
        });
        const result = await newUser.save();
        userData.id = result._id;
      }

      const accessToken = jwt.sign(userData, process.env.JWT_SECRET);

      res.cookie("token", accessToken, { maxAge: 360000 });
      res.redirect("/");
    });
  }
); // Google - get user.
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email", "public_profile"] })
); // Facebook auth.
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/" }),
  async (req, res) => {
    UsersModel.findOne({ facebookId: req.user.id }, async (err, user) => {
      const userData = { displayName: req.user.displayName };

      if (user) {
        userData.id = user._id;
      } else {
        const newUser = new UsersModel({
          facebookId: req.user.id,
          displayName: req.user.displayName,
        });
        const result = await newUser.save();
        userData.id = result._id;
      }

      const accessToken = jwt.sign(userData, process.env.JWT_SECRET);

      res.cookie("token", accessToken, { maxAge: 360000 });
      res.redirect("/");
    });
  }
); // Facebook - get user.
router.get("/twitter", passport.authenticate("twitter", { scope: "email" })); // Twitter auth.
router.get(
  "/twitter/callback",
  passport.authenticate("twitter", { failureRedirect: "/" }),
  async (req, res) => {
    UsersModel.findOne({ twitterId: req.user.id }, async (err, user) => {
      const userData = { displayName: req.user.displayName };

      if (user) {
        userData.id = user._id;
      } else {
        const newUser = new UsersModel({
          twitterId: req.user.id,
          displayName: req.user.displayName,
        });
        const result = await newUser.save();
        userData.id = result._id;
      }

      const accessToken = jwt.sign(userData, process.env.JWT_SECRET);

      res.cookie("token", accessToken, { maxAge: 360000 });
      res.redirect("/");
    });
  }
); // Twitter - get user.
//////////////
// EXPORTS //
////////////
module.exports = router;
