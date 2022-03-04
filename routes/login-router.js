//////////////
// IMPORTS //
////////////
const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
const UsersModel = require(".././models/UsersModel");
const { getHashedPassword, generateAuthToken } = require(".././utils");
/////////////////////
// ROUTE SETTINGS //
///////////////////
router.use(cookieParser());
const authTokens = {};
/////////////
// ROUTES //
///////////
router.get("/", async (req, res) => {
  res.render("login", { signIn: true });
}); // Sign-in page
router.get("/sign-up", async (req, res) => {
  res.render("login", { signIn: false });
}); // Sign-up page
router.post("/sign-in", async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = getHashedPassword(password);
  console.log({ username, password, hashedPassword });

  UsersModel.findOne({ username, password: hashedPassword }, (err, user) => {
    if (user) {
      const authToken = generateAuthToken();
      authTokens[authToken] = user;
      res.cookie("AuthToken", authToken);
      res.redirect("/protected");
    } else {
      const loginFailed = true;
      res.redirect("/login", { loginFailed });
    }
  });
});
router.post("/sign-up", async (req, res) => {
  const { username, password, confirmPassword } = req.body;
  const signIn = true;

  UsersModel.findOne({ username }, async (err, user) => {
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
      console.log(newUser);
      await newUser.save();
      res.redirect("/login");
    }
  });
});
//////////////
// EXPORTS //
////////////
module.exports = router;
