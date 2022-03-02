//////////////
// IMPORTS //
////////////
const express = require("express");
const router = express.Router();
/////////////
// ROUTES //
///////////
router.get("/", async (req, res) => {
  const signIn = true;
  res.render("login", { signIn });
});
//////////////
// EXPORTS //
////////////
module.exports = router;
