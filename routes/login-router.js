//////////////
// IMPORTS //
////////////
const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
const UsersModel = require(".././models/UsersModel");
const jwt = require("jsonwebtoken");
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

  console.log({ username, password, rememberMe });

  UsersModel.findOne({ username }, (err, user) => {
    console.log({ user, username });
    if (user && comparePassword(password, user.password)) {
      const userData = { users: user._id.toString(), username };
      const accessToken = jwt.sign(userData, process.env.JWT_SECRET);

      console.log({ userData });
      console.log({ accessToken });

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
//////////////
// EXPORTS //
////////////
module.exports = router;
