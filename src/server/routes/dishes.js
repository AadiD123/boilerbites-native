const express = require("express");

const {
  getLocationData
} = require("../controllers/dishController");

const router = express.Router();

router.use((req, res, next) => {
  req.db = req.app.locals.db;
  next();
});

router.get("/:location/:date", getLocationData);

module.exports = router;
