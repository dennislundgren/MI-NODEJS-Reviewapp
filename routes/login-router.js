//////////////
// IMPORTS //
////////////
const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
const {
  UsersModel,
  FacebookModel,
  GoogleModel,
  TwitterModel,
} = require(".././models/UsersModel");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const {
  getHashedPassword,
  generateAuthToken,
  hashPassword,
  comparePassword,
} = require(".././utils");
/////////////////////
// ROUTE SETTINGS //
///////////////////
router.use(cookieParser());
const authTokens = {};
//////////////////
// MIDDLEWARES //
////////////////
const forceAuthorize = (req, res, next) => {
  const { token } = req.cookes;
  if (token && jwt.verify(token, process.env.JWT_SECRET)) {
    const tokenData = jwt.decode(token, process.env.JWT_SECRET);
    next();
  } else {
    res.sendStatus(401);
  }
};
/////////////
// ROUTES //
///////////
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
router.get("/secret", forceAuthorize, (req, res) => {
  res.send("This is just a test.");
});
router.post("/sign-in", async (req, res) => {
  const { username, password, rememberMe } = req.body;

  UsersModel.findOne({ username }, (err, user) => {
    if (user && comparePassword(password, user.password)) {
      const userData = { users: user._id.toString(), username };
      const accessToken = jwt.sign(userData, process.env.JWT_SECRET);

      if (rememberMe) {
        res.cookie("token", accessToken, { maxAge: 3600000 });
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
});
router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
  }),
  async (req, res) => {
    GoogleModel.findOne({ googleId: req.user.id }, async (err, user) => {
      const userData = { displayName: req.user.displayName };

      if (user) {
        userData.id = user._id;
      } else {
        const newUser = new GoogleModel({
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
);
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email", "public_profile"] })
);
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/" }),
  async (req, res) => {
    FacebookModel.findOne({ facebookId: req.user.id }, async (err, user) => {
      const userData = { displayName: req.user.displayName };

      if (user) {
        userData.id = user._id;
      } else {
        const newUser = new FacebookModel({
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
);
router.get("/twitter", passport.authenticate("twitter", { scope: "email" }));
router.get(
  "/twitter/callback",
  passport.authenticate("twitter", { failureRedirect: "/" }),
  async (req, res) => {
    TwitterModel.findOne({ twitterId: req.user.id }, async (err, user) => {
      const userData = { displayName: req.user.displayName };

      if (user) {
        userData.id = user._id;
      } else {
        const newUser = new TwitterModel({
          twitterId: req.user.id,
          displayName: req.user.username,
        });
        const result = await newUser.save();
        userData.id = result._id;
      }

      const accessToken = jwt.sign(userData, process.env.JWT_SECRET);

      res.cookie("token", accessToken, { maxAge: 360000 });
      res.redirect("/");
    });
  }
);
//////////////
// EXPORTS //
////////////
module.exports = router;
