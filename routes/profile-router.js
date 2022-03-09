//////////////
// IMPORTS //
////////////
const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
///////////////////
// ROUTER SETUP //
/////////////////
router.use(cookieParser());
/////////////
// ROUTES //
///////////
router.get("/:id", async (req, res) => {
  const id = req.params.id;
});
