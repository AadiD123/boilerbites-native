const express = require("express");
const {
  getLocationData
} = require("../controllers/dishController");

const router = express.Router();
router.get("/:location/:date", getLocationData);

module.exports = router;
