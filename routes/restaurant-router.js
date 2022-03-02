const express = require("express")

const router = express.Router();

router.get("/", async (req, res) => {
    console.log("wow ok")
})

module.exports = router